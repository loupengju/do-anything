"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Upload,
  Download,
  FileCode2,
  Maximize,
  Trash2,
  Copy,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface ConversionResult {
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

const SPRITE_FORMATS = [
  { value: "css", label: "CSS (background)" },
  { value: "view", label: "View (with <view>)" },
  { value: "defs", label: "Defs (<defs>)" },
  { value: "symbol", label: "Symbol (<symbol>)" },
  { value: "stack", label: "Stack" },
];

export default function Page() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState<number>(0);
  const [selectedFormat, setSelectedFormat] = useState<string>("symbol");
  const [isConverting, setIsConverting] = useState(false);
  const [convertedResult, setConvertedResult] =
    useState<ConversionResult | null>(null);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [usageExamples, setUsageExamples] = useState<Record<string, string>>(
    {}
  );
  const [activeTab, setActiveTab] = useState("svg");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles: File[] = [];
    const newPreviewUrls: string[] = [];

    // 处理所有选择的文件
    Array.from(files).forEach((file) => {
      // 检查是否为SVG文件
      if (!file.name.toLowerCase().endsWith(".svg")) {
        toast.error(`文件 ${file.name} 不是有效的SVG文件`);
        return;
      }

      newFiles.push(file);
      newPreviewUrls.push(URL.createObjectURL(file));
    });

    // 更新状态
    setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    setPreviewUrls((prevUrls) => [...prevUrls, ...newPreviewUrls]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles: File[] = [];
      const newPreviewUrls: string[] = [];

      Array.from(e.dataTransfer.files).forEach((file) => {
        if (!file.name.toLowerCase().endsWith(".svg")) {
          toast.error(`文件 ${file.name} 不是有效的SVG文件`);
          return;
        }

        newFiles.push(file);
        newPreviewUrls.push(URL.createObjectURL(file));
      });

      setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
      setPreviewUrls((prevUrls) => [...prevUrls, ...newPreviewUrls]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newFiles = [...selectedFiles];
    const newUrls = [...previewUrls];

    // 释放URL对象
    URL.revokeObjectURL(newUrls[index]);

    // 移除文件和URL
    newFiles.splice(index, 1);
    newUrls.splice(index, 1);

    setSelectedFiles(newFiles);
    setPreviewUrls(newUrls);

    // 调整当前预览索引
    if (currentPreviewIndex >= newUrls.length) {
      setCurrentPreviewIndex(Math.max(0, newUrls.length - 1));
    }
  };

  const handleOpenPreview = (index: number) => {
    setCurrentPreviewIndex(index);
    setShowPreviewDialog(true);
  };

  const handleNextPreview = () => {
    setCurrentPreviewIndex((prev) => (prev + 1) % previewUrls.length);
  };

  const handlePrevPreview = () => {
    setCurrentPreviewIndex(
      (prev) => (prev - 1 + previewUrls.length) % previewUrls.length
    );
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleGenerateSprite = async () => {
    if (selectedFiles.length === 0) {
      toast.error("请先选择至少一个SVG文件");
      return;
    }

    setIsConverting(true);
    // 清除之前的转换结果
    setConvertedResult(null);
    setUsageExamples({});

    try {
      // 创建FormData对象
      const formData = new FormData();

      // 添加所有文件
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });

      formData.append("spriteFormat", selectedFormat);

      // 调用后端API进行SVG雪碧图生成
      const response = await fetch("/api/generate-svg-sprite", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "生成失败");
      }

      const result = await response.json();
      setConvertedResult(result);
      setUsageExamples(result.examples || {});

      toast.success(`已成功生成SVG雪碧图`);
    } catch (error) {
      console.error("生成错误:", error);
      toast.error(
        `生成失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = (fileType: string) => {
    if (!convertedResult) return;
    if (fileType === "svg" || (fileType === "css" && convertedResult.css)) {
      // Get the correct file data
      const fileData =
        fileType === "svg" ? convertedResult.svg : convertedResult.css;

      if (!fileData) return;

      // 创建Blob对象
      const blob = new Blob([fileData.content], {
        type: fileType === "css" ? "text/css" : "image/svg+xml",
      });

      // 创建下载链接
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileData.filename;
      document.body.appendChild(a);
      a.click();

      // 清理
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("下载已开始");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success("已复制到剪贴板");
      },
      () => {
        toast.error("复制失败");
      }
    );
  };

  return (
    <Card className="w-full max-w-full sm:max-w-2xl lg:max-w-3xl mx-auto animate-[fadeIn_0.5s_ease-in-out] backdrop-blur-sm bg-gradient-to-b from-card/95 to-card/90 shadow-2xl border border-primary/20 rounded-2xl overflow-hidden hover:shadow-primary/5 transition-all duration-500">
      <CardHeader className="pb-4 border-b border-primary/20">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent inline-block pb-1">
                SVG雪碧图生成器
              </span>
            </CardTitle>
            <CardDescription className="text-sm opacity-90 max-w-md">
              轻松将您的SVG文件合并为雪碧图，支持CSS、View、Defs、Symbol和Stack等多种格式
            </CardDescription>
          </div>
          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary/30 to-blue-500/30 flex items-center justify-center shadow-lg shadow-primary/10 p-2.5 backdrop-blur-md">
            <FileCode2 className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 pb-4">
        <div className="space-y-7">
          <div className="animate-[fadeIn_0.6s_ease-in-out]">
            <Label
              htmlFor="svg-upload"
              className="text-sm font-medium flex items-center gap-2 mb-3 text-primary/90"
            >
              <Upload className="h-4 w-4" />
              选择SVG文件
            </Label>
            <div>
              <Input
                ref={fileInputRef}
                id="svg-upload"
                type="file"
                accept=".svg"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              {previewUrls.length === 0 ? (
                <div
                  onClick={triggerFileInput}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="w-full h-32 sm:h-40 border-dashed border-2 flex flex-col gap-4 hover:border-primary/70 hover:bg-primary/5 transition-all duration-300 group rounded-xl bg-gradient-to-b from-black/5 to-primary/5 dark:from-white/5 dark:to-primary/10 shadow-inner cursor-pointer"
                >
                  <div className="h-14 w-14 rounded-full bg-gradient-to-r from-primary/10 to-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-all duration-300 mt-4 mx-auto">
                    <Upload className="h-6 w-6 group-hover:text-primary transition-colors duration-300 opacity-80 group-hover:opacity-100" />
                  </div>
                  <span className="group-hover:text-primary transition-colors duration-300 text-sm font-medium mx-auto mb-4">
                    点击或拖放SVG文件到这里
                  </span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {previewUrls.map((url, index) => (
                      <div
                        key={index}
                        className="relative border-2 rounded-xl p-2 bg-gradient-to-b from-black/5 to-primary/5 dark:from-white/5 dark:to-primary/10 shadow-inner backdrop-blur-sm group transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                      >
                        <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-7 w-7 rounded-full bg-white/90 dark:bg-black/70 shadow-md hover:shadow-primary/20 transition-all duration-300"
                            onClick={() => handleOpenPreview(index)}
                          >
                            <Maximize className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            className="h-7 w-7 rounded-full bg-white/90 dark:bg-black/70 shadow-md hover:shadow-destructive/20 transition-all duration-300"
                            onClick={() => handleRemoveImage(index)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <div className="aspect-square flex items-center justify-center overflow-hidden rounded-md">
                          <Image
                            src={url}
                            alt={`SVG Preview ${index}`}
                            className="h-full w-full object-contain p-2"
                            width={200}
                            height={200}
                            unoptimized={true}
                          />
                        </div>
                        <div className="mt-2 text-center text-xs truncate px-1">
                          {selectedFiles[index]?.name}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={triggerFileInput}
                      className="text-xs"
                    >
                      添加更多SVG
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setSelectedFiles([]);
                        setPreviewUrls([]);
                      }}
                      className="text-xs"
                    >
                      清空所有
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <Dialog
              open={showPreviewDialog}
              onOpenChange={setShowPreviewDialog}
            >
              <DialogContent className="sm:max-w-md">
                <DialogTitle>SVG预览</DialogTitle>
                <div className="relative aspect-square w-full overflow-auto border rounded-lg p-4">
                  <Image
                    src={previewUrls[currentPreviewIndex]}
                    alt="SVG Preview"
                    className="h-full w-full object-contain"
                    width={500}
                    height={500}
                    unoptimized={true}
                  />
                </div>
                {previewUrls.length > 1 && (
                  <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
                    <Button
                      onClick={handlePrevPreview}
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 rounded-full bg-white/80 dark:bg-black/60 shadow-md hover:shadow-primary/20 transition-all duration-300"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-chevron-left"
                      >
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                    </Button>
                    <span className="bg-white/80 dark:bg-black/60 text-xs font-medium px-3 py-1.5 rounded-full shadow-md">
                      {currentPreviewIndex + 1} / {previewUrls.length}
                    </span>
                    <Button
                      onClick={handleNextPreview}
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 rounded-full bg-white/80 dark:bg-black/60 shadow-md hover:shadow-primary/20 transition-all duration-300"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-chevron-right"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </Button>
                  </div>
                )}
                <div className="px-4 pb-2">
                  <p className="text-sm font-medium truncate">
                    {selectedFiles[currentPreviewIndex]?.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedFiles[currentPreviewIndex]
                      ? `${(
                          selectedFiles[currentPreviewIndex].size / 1024
                        ).toFixed(1)} KB`
                      : ""}
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Separator className="my-3 opacity-30 bg-gradient-to-r from-transparent via-primary/20 to-transparent h-px" />

          <div className="animate-[fadeIn_0.7s_ease-out]">
            <Label
              htmlFor="format"
              className="text-sm font-medium flex items-center gap-2 mb-3 text-primary/90"
            >
              <div className="h-5 w-5 rounded-md bg-gradient-to-r from-primary/20 to-blue-500/20 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-file-type text-primary"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              雪碧图格式
            </Label>
            <Select value={selectedFormat} onValueChange={setSelectedFormat}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="选择雪碧图格式" />
              </SelectTrigger>
              <SelectContent>
                {SPRITE_FORMATS.map((format) => (
                  <SelectItem key={format.value} value={format.value}>
                    {format.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-4 pt-2 pb-6">
        <Button
          className="w-full bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 text-white font-medium py-2 rounded-md transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 active:shadow-sm"
          onClick={handleGenerateSprite}
          disabled={isConverting || selectedFiles.length === 0}
        >
          {isConverting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              生成中...
            </>
          ) : (
            "生成SVG雪碧图"
          )}
        </Button>

        {convertedResult && (
          <div className="w-full p-4 bg-black/5 dark:bg-white/5 rounded-xl mt-4 animate-[fadeIn_0.5s_ease-in-out]">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-primary/90">
                  雪碧图已生成
                </h3>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownload("svg")}
                    className="flex items-center gap-1.5"
                  >
                    <Download className="h-4 w-4" />
                    下载SVG
                  </Button>
                  {convertedResult.css && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload("css")}
                      className="flex items-center gap-1.5"
                    >
                      <Download className="h-4 w-4" />
                      下载CSS
                    </Button>
                  )}
                </div>
              </div>

              <div className="bg-black/10 dark:bg-black/40 rounded-lg p-4 mt-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button
                    variant={activeTab === "svg" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTab("svg")}
                  >
                    SVG
                  </Button>
                  {convertedResult.css && (
                    <Button
                      variant={activeTab === "css" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveTab("css")}
                    >
                      CSS
                    </Button>
                  )}
                  <Button
                    variant={activeTab === "examples" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTab("examples")}
                  >
                    使用示例
                  </Button>
                </div>

                {activeTab === "svg" && (
                  <div className="relative">
                    <pre className="overflow-auto text-xs p-4 bg-black/20 dark:bg-black/60 rounded-md max-h-60">
                      <code>{convertedResult.svg.content}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute top-2 right-2 p-1.5 h-8 w-8"
                      onClick={() =>
                        copyToClipboard(convertedResult.svg.content)
                      }
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {activeTab === "css" && convertedResult.css && (
                  <div className="relative">
                    <pre className="overflow-auto text-xs p-4 bg-black/20 dark:bg-black/60 rounded-md max-h-60">
                      <code>{convertedResult.css.content}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute top-2 right-2 p-1.5 h-8 w-8"
                      onClick={() =>
                        convertedResult.css &&
                        copyToClipboard(convertedResult.css.content)
                      }
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {activeTab === "examples" && (
                  <div className="space-y-4">
                    {Object.entries(usageExamples).map(([key, example]) => (
                      <div
                        key={key}
                        className="bg-black/20 dark:bg-black/60 rounded-md p-4"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-medium">{key}</h4>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="p-1 h-7 w-7"
                            onClick={() => copyToClipboard(example)}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <pre className="overflow-auto text-xs">
                          <code>{example}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
