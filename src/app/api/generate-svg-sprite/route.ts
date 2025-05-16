import { NextRequest, NextResponse } from "next/server";
import SVGSpriter from "svg-sprite";
import path from "path";

// 定义不同的雪碧图格式配置
const SPRITE_FORMATS = {
  css: {
    render: {
      css: true,
    },
  },
  view: {
    render: {
      css: true,
    },
  },
  defs: {
    example: true,
  },
  symbol: {
    example: true,
  },
  stack: {
    example: true,
  },
};

// 定义SVG Spriter响应对象类型
interface SpriterResponse {
  svg: {
    content: string;
    filename: string;
  };
  css?: {
    content: string;
    filename: string;
  };
  examples: Record<string, string>;
}

/**
 * 为不同的雪碧图格式生成使用示例
 * @param format 雪碧图格式
 * @param svgFilenames SVG文件名数组（不含扩展名）
 * @param spriteFilename 雪碧图文件名
 * @returns 示例代码的键值对
 */
function generateCustomExamples(
  format: string,
  svgFilenames: string[],
  spriteFilename: string
): Record<string, string> {
  const examples: Record<string, string> = {};
  const firstIcon = svgFilenames[0] || "icon";

  // 根据不同格式生成示例
  switch (format) {
    case "css":
      examples["CSS用法"] = `.icon-${firstIcon} {
  width: 24px;
  height: 24px;
  background-image: url('${spriteFilename}');
  background-position: 0 0;
  background-repeat: no-repeat;
}`;
      examples["HTML用法"] = `<div class="icon-${firstIcon}"></div>`;
      break;

    case "view":
      examples["HTML用法"] = `<svg>
  <use href="${spriteFilename}#view-${firstIcon}" />
</svg>`;
      break;

    case "defs":
      examples["HTML用法"] = `<svg width="24" height="24">
  <use xlink:href="${spriteFilename}#${firstIcon}" />
</svg>`;
      break;

    case "symbol":
      examples["HTML用法"] = `<svg width="24" height="24">
  <use href="${spriteFilename}#${firstIcon}" />
</svg>`;

      examples["内联SVG用法"] = `<!-- 将雪碧图直接内联到HTML中 -->
<!-- 然后可以这样使用图标 -->
<svg width="24" height="24">
  <use href="#${firstIcon}" />
</svg>`;
      break;

    case "stack":
      examples["HTML用法"] = `<svg>
  <use href="${spriteFilename}#${firstIcon}" />
</svg>`;
      break;
  }

  // 所有格式通用的示例
  examples["所有图标"] = svgFilenames
    .map(
      (name) =>
        `<!-- ${name} -->
<svg width="24" height="24">
  <use href="${spriteFilename}#${name}" />
</svg>`
    )
    .join("\n\n");

  // React组件示例
  examples["React组件示例"] = `// SvgIcon.jsx
import React from 'react';

export const SvgIcon = ({ name, size = 24 }) => (
  <svg width={size} height={size}>
    <use href="${spriteFilename}#${firstIcon}" />
  </svg>
);

// 使用方式
<SvgIcon name="${firstIcon}" size={32} />`;

  return examples;
}

export async function POST(request: NextRequest) {
  try {
    // 获取表单数据
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const spriteFormat = (formData.get("spriteFormat") as string) || "symbol";

    if (!files.length) {
      return NextResponse.json({ error: "缺少SVG文件" }, { status: 400 });
    }

    if (!Object.keys(SPRITE_FORMATS).includes(spriteFormat)) {
      return NextResponse.json(
        { error: "不支持的雪碧图格式" },
        { status: 400 }
      );
    }

    // 创建SVG Spriter实例
    const config = {
      mode: {
        [spriteFormat]: true,
      },
      shape: {
        id: {
          generator: (name: string) => {
            // 从文件名中提取ID，去掉扩展名和路径
            return path.basename(name, ".svg");
          },
        },
      },
      svg: {
        namespaceIDs: true,
        namespaceClassnames: true,
      },
    };

    // 创建spriter实例
    const spriter = new SVGSpriter(config);
    const filenames: string[] = [];

    // 处理每个文件并添加到spriter实例
    for (const file of files) {
      const content = await file.text();
      const filename = file.name;
      const basename = path.basename(filename, ".svg");
      filenames.push(basename);

      spriter.add(filename, null, content);
    }

    // 编译雪碧图
    const { result } = await spriter.compileAsync();

    // 根据输出格式提取结果
    const mode = result[spriteFormat];
    if (!mode) {
      throw new Error(`生成${spriteFormat}格式雪碧图失败`);
    }

    // 提取SVG雪碧图
    const svgResource = mode.sprite;
    const svgContent = svgResource.contents.toString();
    const spriteFilename = `sprite.${spriteFormat}.svg`;

    // 生成自定义示例
    const examples = generateCustomExamples(
      spriteFormat,
      filenames,
      spriteFilename
    );

    // 构建响应
    const response: SpriterResponse = {
      svg: {
        content: svgContent,
        filename: spriteFilename,
      },
      examples,
    };

    // 如果有CSS，添加到响应中
    if (mode.css) {
      const cssContent = mode.css.contents.toString();
      response.css = {
        content: cssContent,
        filename: `sprite.${spriteFormat}.css`,
      };
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("SVG雪碧图生成错误:", error);
    return NextResponse.json({ error: "生成SVG雪碧图失败" }, { status: 500 });
  }
}
