import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    // 获取表单数据
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const targetFormat = formData.get('targetFormat') as string;
    
    if (!file || !targetFormat) {
      return NextResponse.json(
        { error: '缺少文件或目标格式' },
        { status: 400 }
      );
    }

    // 读取文件内容
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // 使用sharp进行格式转换
    let convertedBuffer;
    switch (targetFormat) {
      case 'png':
        convertedBuffer = await sharp(buffer).png().toBuffer();
        break;
      case 'jpeg':
        convertedBuffer = await sharp(buffer).jpeg().toBuffer();
        break;
      case 'webp':
        convertedBuffer = await sharp(buffer).webp().toBuffer();
        break;
      case 'gif':
        convertedBuffer = await sharp(buffer).gif().toBuffer();
        break;
      default:
        return NextResponse.json(
          { error: '不支持的格式' },
          { status: 400 }
        );
    }

    // 返回转换后的图片
    return new NextResponse(convertedBuffer, {
      headers: {
        'Content-Type': `image/${targetFormat}`,
        'Content-Disposition': `attachment; filename="converted.${targetFormat}"`,
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