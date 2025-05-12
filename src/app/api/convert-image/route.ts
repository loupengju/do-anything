import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import archiver from 'archiver';
import { Readable } from 'stream';

export async function POST(request: NextRequest) {
  try {
    // 获取表单数据
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const targetFormat = formData.get('targetFormat') as string;
    const isMultipleFiles = formData.get('multipleFiles') === 'true';
    
    // 获取调整大小的参数
    const resize = formData.get('resize') === 'true';
    const width = resize ? parseInt(formData.get('width') as string) : null;
    const height = resize ? parseInt(formData.get('height') as string) : null;
    
    if (!files.length || !targetFormat) {
      return NextResponse.json(
        { error: '缺少文件或目标格式' },
        { status: 400 }
      );
    }

    // 如果只有一个文件，直接处理并返回
    if (files.length === 1 && !isMultipleFiles) {
      const file = files[0];
      const buffer = Buffer.from(await file.arrayBuffer());
      
      // 创建sharp实例
      let sharpInstance = sharp(buffer);
      
      // 如果需要调整大小
      if (resize && width && height) {
        sharpInstance = sharpInstance.resize(width, height);
      }
      
      // 使用sharp进行格式转换
      let convertedBuffer;
      switch (targetFormat) {
        case 'png':
          convertedBuffer = await sharpInstance.png().toBuffer();
          break;
        case 'jpeg':
          convertedBuffer = await sharpInstance.jpeg().toBuffer();
          break;
        case 'webp':
          convertedBuffer = await sharpInstance.webp().toBuffer();
          break;
        case 'gif':
          convertedBuffer = await sharpInstance.gif().toBuffer();
          break;
        default:
          return NextResponse.json(
            { error: '不支持的格式' },
            { status: 400 }
          );
      }

      // 返回转换后的单个图片
      return new NextResponse(convertedBuffer, {
        headers: {
          'Content-Type': `image/${targetFormat}`,
          'Content-Disposition': `attachment; filename="converted.${targetFormat}"`,
        },
      });
    }
    
    // 处理多个文件，创建zip压缩包
    const archive = archiver('zip', {
      zlib: { level: 9 } // 最高压缩级别
    });
    
    // 创建一个可读流来存储zip数据
    const chunks: Uint8Array[] = [];
    archive.on('data', (chunk) => chunks.push(chunk));
    
    // 处理每个文件并添加到zip
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const buffer = Buffer.from(await file.arrayBuffer());
      
      // 创建sharp实例
      let sharpInstance = sharp(buffer);
      
      // 如果需要调整大小
      if (resize && width && height) {
        sharpInstance = sharpInstance.resize(width, height);
      }
      
      // 使用sharp进行格式转换
      let convertedBuffer;
      switch (targetFormat) {
        case 'png':
          convertedBuffer = await sharpInstance.png().toBuffer();
          break;
        case 'jpeg':
          convertedBuffer = await sharpInstance.jpeg().toBuffer();
          break;
        case 'webp':
          convertedBuffer = await sharpInstance.webp().toBuffer();
          break;
        case 'gif':
          convertedBuffer = await sharpInstance.gif().toBuffer();
          break;
        default:
          return NextResponse.json(
            { error: '不支持的格式' },
            { status: 400 }
          );
      }
      
      // 获取原始文件名（不带扩展名）并添加新扩展名
      const originalName = file.name.split('.').slice(0, -1).join('.') || 'image';
      const newFileName = `${originalName}.${targetFormat}`;
      
      // 添加到zip
      archive.append(convertedBuffer, { name: newFileName });
    }
    
    // 完成zip文件
    await archive.finalize();
    
    // 合并所有数据块
    const zipBuffer = Buffer.concat(chunks);
    
    // 返回zip文件
    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="converted_images.zip"',
      },
    });
  } catch (error) {
    console.error('图片转换错误:', error);
    return NextResponse.json(
      { error: '图片转换失败' },
      { status: 500 }
    );
  }
}