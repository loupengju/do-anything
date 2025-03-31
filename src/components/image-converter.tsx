'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Upload, Download, Image as ImageIcon, Maximize, Trash2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const IMAGE_FORMATS = [
  { value: 'png', label: 'PNG' },
  { value: 'jpeg', label: 'JPEG' },
  { value: 'webp', label: 'WebP' },
  { value: 'gif', label: 'GIF' },
  { value: 'svg', label: 'SVG' },
];

export function ImageConverter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<string>('png');
  const [isConverting, setIsConverting] = useState(false);
  const [convertedImageUrl, setConvertedImageUrl] = useState<string | null>(null);
  const [convertedFileName, setConvertedFileName] = useState<string>('');
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 检查是否为图片文件
    if (!file.type.startsWith('image/')) {
      toast.error('请选择有效的图片文件');
      return;
    }

    setSelectedFile(file);
    
    // 创建预览URL
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
  };
  
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleOpenPreview = () => {
    setShowPreviewDialog(true);
  };

  const handleFormatChange = (value: string) => {
    setTargetFormat(value);
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      toast.error('请先选择一个图片文件');
      return;
    }

    setIsConverting(true);
    // 清除之前的转换结果
    setConvertedImageUrl(null);
    
    try {
      // 创建FormData对象
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('targetFormat', targetFormat);
      
      // 调用后端API进行图片转换
      const response = await fetch('/api/convert-image', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '转换失败');
      }
      
      // 获取转换后的图片blob
      const blob = await response.blob();
      
      // 创建下载链接
      const url = URL.createObjectURL(blob);
      const fileName = `converted.${targetFormat}`;
      
      // 保存转换后的图片URL和文件名
      setConvertedImageUrl(url);
      setConvertedFileName(fileName);
      
      toast.success(`已成功将图片转换为 ${targetFormat.toUpperCase()} 格式`);
    } catch (error) {
      console.error('转换错误:', error);
      toast.error(`转换失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsConverting(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleDownload = () => {
    if (convertedImageUrl && convertedFileName) {
      // 创建下载元素
      const a = document.createElement('a');
      a.href = convertedImageUrl;
      a.download = convertedFileName;
      document.body.appendChild(a);
      a.click();
      
      // 清理
      document.body.removeChild(a);
      toast.success('下载已开始');
    }
  };

  return (
    <Card className="w-full max-w-full sm:max-w-2xl lg:max-w-3xl mx-auto animate-[fadeIn_0.5s_ease-in-out] backdrop-blur-sm bg-gradient-to-b from-card/95 to-card/90 shadow-2xl border border-primary/20 rounded-2xl overflow-hidden hover:shadow-primary/5 transition-all duration-500">
      <CardHeader className="pb-4 border-b border-primary/20">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent inline-block pb-1">图片格式转换</span>
            </CardTitle>
            <CardDescription className="text-sm opacity-90 max-w-md">
              轻松将您的图片转换为各种格式，支持PNG、JPEG、WebP、GIF和SVG
            </CardDescription>
          </div>
          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary/30 to-blue-500/30 flex items-center justify-center shadow-lg shadow-primary/10 p-2.5 backdrop-blur-md">
            <ImageIcon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 pb-4">
        <div className="space-y-7">
          <div className="animate-[fadeIn_0.6s_ease-in-out]">
            <Label htmlFor="image-upload" className="text-sm font-medium flex items-center gap-2 mb-3 text-primary/90">
              <Upload className="h-4 w-4" />
              选择图片
            </Label>
            <div>
              <Input
                ref={fileInputRef}
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              {!previewUrl ? (
                <Button 
                  onClick={triggerFileInput}
                  variant="outline"
                  className="w-full h-32 sm:h-40 border-dashed border-2 flex flex-col gap-4 hover:border-primary/70 hover:bg-primary/5 transition-all duration-300 group rounded-xl bg-gradient-to-b from-black/5 to-primary/5 dark:from-white/5 dark:to-primary/10 shadow-inner"
                >
                  <div className="h-14 w-14 rounded-full bg-gradient-to-r from-primary/10 to-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                    <Upload className="h-6 w-6 group-hover:text-primary transition-colors duration-300 opacity-80 group-hover:opacity-100" />
                  </div>
                  <span className="group-hover:text-primary transition-colors duration-300 text-sm font-medium">点击或拖放图片到这里</span>
                </Button>
              ) : (
                <div className="relative border-2 rounded-xl p-3 bg-gradient-to-b from-black/5 to-primary/5 dark:from-white/5 dark:to-primary/10 shadow-inner backdrop-blur-sm group transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-white/90 dark:bg-black/70 shadow-md hover:shadow-primary/20 transition-all duration-300" onClick={handleOpenPreview}>
                      <Maximize className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="destructive" className="h-8 w-8 rounded-full bg-white/90 dark:bg-black/70 shadow-md hover:shadow-destructive/20 transition-all duration-300" onClick={handleRemoveImage}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 p-2">
                    <div className="relative h-20 w-20 rounded-lg overflow-hidden border border-primary/20 shadow-md shadow-primary/10 flex-shrink-0 transition-all duration-300 group-hover:scale-105">
                      <img 
                        src={previewUrl} 
                        alt="缩略图" 
                        className="h-full w-full object-cover" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-medium truncate">{selectedFile?.name}</p>
                      <p className="text-sm text-muted-foreground mt-1.5">{selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : ''}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
            <DialogContent className="max-w-4xl bg-gradient-to-b from-background to-background/95 backdrop-blur-xl border-primary/20 shadow-xl">
              {previewUrl && (
                <div className="flex justify-center items-center p-4">
                  <img 
                    src={previewUrl} 
                    alt="预览" 
                    className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg shadow-lg" 
                  />
                </div>
              )}
            </DialogContent>
          </Dialog>

          <Separator className="my-3 opacity-30 bg-gradient-to-r from-transparent via-primary/20 to-transparent h-px" />

          <div className="animate-[fadeIn_0.7s_ease-out]">
            <Label htmlFor="format" className="text-sm font-medium flex items-center gap-2 mb-3 text-primary/90">
              <div className="h-5 w-5 rounded-md bg-gradient-to-r from-primary/20 to-blue-500/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-type text-primary">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              目标格式
            </Label>
            <Select value={targetFormat} onValueChange={handleFormatChange}>
              <SelectTrigger id="format" className="h-12 text-sm rounded-xl border-2 hover:border-primary/50 transition-all duration-300 bg-gradient-to-b from-black/5 to-primary/5 dark:from-white/5 dark:to-primary/10 shadow-inner focus:ring-2 focus:ring-primary/20 focus:border-primary/40">
                <SelectValue placeholder="选择目标格式" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-2 border-primary/20 shadow-xl bg-gradient-to-b from-background to-background/95 backdrop-blur-xl">
                {IMAGE_FORMATS.map((format) => (
                  <SelectItem key={format.value} value={format.value} className="text-sm py-3 hover:bg-primary/10 cursor-pointer my-0.5 rounded-lg font-medium">
                    {format.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-5 pt-3 pb-6 px-6 bg-gradient-to-b from-transparent to-primary/5">
        <Button 
          onClick={handleConvert} 
          disabled={!selectedFile || isConverting}
          className="w-full py-5 text-base font-medium relative overflow-hidden group rounded-xl shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all duration-500 animate-[fadeIn_0.8s_ease-out]"
        >
          <span className="relative z-10 flex items-center justify-center gap-3 text-white">
            {isConverting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="animate-pulse">正在转换图片</span>
                <span className="inline-block animate-[bounce_1s_infinite]">
                  <span className="inline-block animate-[bounce_1s_infinite_0.1s]">.</span>
                  <span className="inline-block animate-[bounce_1s_infinite_0.2s]">.</span>
                  <span className="inline-block animate-[bounce_1s_infinite_0.3s]">.</span>
                </span>
              </>
            ) : (
              <>
                开始转换
                <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                  <ImageIcon className="h-3.5 w-3.5 text-white transition-all duration-300" />
                </div>
              </>
            )}
          </span>
          {!isConverting && (
            <span className="absolute inset-0 bg-gradient-to-r from-primary to-blue-500 opacity-90 group-hover:opacity-100 transition-all duration-300 z-0 group-hover:scale-[1.02]"></span>
          )}
        </Button>

        {convertedImageUrl && (
          <Button 
            onClick={handleDownload}
            variant="outline"
            className="w-full py-4 text-base font-medium relative overflow-hidden group rounded-xl shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all duration-500 border-2 border-primary/30 animate-[fadeIn_0.5s_ease-in-out]"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              下载转换后的图片
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                <Download className="h-3.5 w-3.5 group-hover:translate-y-0.5 transition-transform duration-300" />
              </div>
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-primary to-blue-500 opacity-0 group-hover:opacity-90 transition-all duration-300 z-0 group-hover:scale-[1.02]"></span>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}