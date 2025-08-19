'use client'

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload as UploadIcon, FileImage, X, Type } from "lucide-react";
import { cn } from "@/lib/utils";

const Upload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [outputFormats, setOutputFormats] = useState<string[]>(["DST"]);
  const [priority, setPriority] = useState("normal");
  const [uploadType, setUploadType] = useState<"file" | "text">("file");
  const [textContent, setTextContent] = useState("");
  const [textShape, setTextShape] = useState<"line" | "circle">("line");
  const [units, setUnits] = useState<"mm" | "inches">("mm");
  const [lineLength, setLineLength] = useState(100); // mm
  const [circleRadius, setCircleRadius] = useState(50); // mm
  
  // Calculate max characters based on shape and size
  const getMaxCharacters = () => {
    const avgCharWidth = units === "mm" ? 6 : 0.236; // mm or inches
    const lengthInUnits = units === "mm" ? lineLength : lineLength / 25.4;
    const radiusInUnits = units === "mm" ? circleRadius : circleRadius / 25.4;
    
    if (textShape === "line") {
      return Math.floor((units === "mm" ? lineLength : lengthInUnits * 25.4) / (units === "mm" ? avgCharWidth : avgCharWidth * 25.4));
    } else {
      const circumference = 2 * Math.PI * (units === "mm" ? circleRadius : radiusInUnits * 25.4);
      return Math.floor(circumference / (units === "mm" ? avgCharWidth : avgCharWidth * 25.4));
    }
  };
  
  const MAX_TEXT_LENGTH = getMaxCharacters();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files).filter(file => 
        file.type.startsWith('image/') || file.name.endsWith('.svg')
      );
      setFiles(prev => [...prev, ...newFiles]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleFormatChange = (format: string, checked: boolean) => {
    if (checked) {
      setOutputFormats(prev => [...prev, format]);
    } else {
      setOutputFormats(prev => prev.filter(f => f !== format));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadType === "file") {
      console.log("Uploading files:", files, "Formats:", outputFormats, "Priority:", priority);
    } else {
      console.log("Digitizing text:", textContent, "Formats:", outputFormats, "Priority:", priority);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 lg:mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Create Embroidery Design</h1>
            <p className="text-muted-foreground">Convert your artwork or text into embroidery machine files</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Design Input</CardTitle>
                <CardDescription>Choose how you want to create your embroidery design</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={uploadType} onValueChange={(value) => setUploadType(value as "file" | "text")} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="file" className="gap-2">
                      <UploadIcon className="h-4 w-4" />
                      <span className="hidden sm:inline">Upload File</span>
                      <span className="sm:hidden">File</span>
                    </TabsTrigger>
                    <TabsTrigger value="text" className="gap-2">
                      <Type className="h-4 w-4" />
                      <span className="hidden sm:inline">Text Design</span>
                      <span className="sm:hidden">Text</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="file" className="mt-4">
                    <div
                      className={cn(
                        "border-2 border-dashed rounded-lg p-6 lg:p-8 text-center transition-colors",
                        dragActive 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50"
                      )}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <UploadIcon className="mx-auto h-8 lg:h-12 w-8 lg:w-12 text-muted-foreground mb-3 lg:mb-4" />
                      <p className="text-base lg:text-lg font-medium mb-2">Drop your files here</p>
                      <p className="text-sm lg:text-base text-muted-foreground mb-3 lg:mb-4">
                        PNG, JPG, or SVG files (max 10MB each)
                      </p>
                      <Input
                        type="file"
                        multiple
                        accept="image/*,.svg"
                        onChange={handleFileInput}
                        className="hidden"
                        id="file-upload"
                      />
                      <Button type="button" variant="outline" asChild>
                        <label htmlFor="file-upload" className="cursor-pointer">
                          Choose Files
                        </label>
                      </Button>
                    </div>

                    {files.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <h4 className="font-medium">Selected Files:</h4>
                        {files.map((file, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                            <FileImage className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="flex-1 truncate">{file.name}</span>
                            <span className="text-sm text-muted-foreground hidden sm:block">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                   <TabsContent value="text" className="mt-4">
                     <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="text-shape">Text Layout</Label>
                            <Select value={textShape} onValueChange={(value) => setTextShape(value as "line" | "circle")}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="line">Straight Line</SelectItem>
                                <SelectItem value="circle">Curved (Circle)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor="units">Units</Label>
                            <Select value={units} onValueChange={(value) => setUnits(value as "mm" | "inches")}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="mm">Millimeters (mm)</SelectItem>
                                <SelectItem value="inches">Inches</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {textShape === "line" ? (
                            <div>
                              <Label htmlFor="line-length">Line Length ({units})</Label>
                              <Input
                                id="line-length"
                                type="number"
                                min={units === "mm" ? "20" : "0.8"}
                                max={units === "mm" ? "300" : "12"}
                                step={units === "mm" ? "1" : "0.1"}
                                value={units === "mm" ? lineLength : (lineLength / 25.4).toFixed(1)}
                                onChange={(e) => setLineLength(units === "mm" ? Number(e.target.value) : Number(e.target.value) * 25.4)}
                                className="mt-1"
                              />
                            </div>
                          ) : (
                            <div>
                              <Label htmlFor="circle-radius">Circle Radius ({units})</Label>
                              <Input
                                id="circle-radius"
                                type="number"
                                min={units === "mm" ? "10" : "0.4"}
                                max={units === "mm" ? "100" : "4"}
                                step={units === "mm" ? "1" : "0.1"}
                                value={units === "mm" ? circleRadius : (circleRadius / 25.4).toFixed(1)}
                                onChange={(e) => setCircleRadius(units === "mm" ? Number(e.target.value) : Number(e.target.value) * 25.4)}
                                className="mt-1"
                              />
                            </div>
                          )}
                          
                          <div className="flex items-end">
                            <div className="text-sm text-muted-foreground">
                              Max characters: <span className="font-medium">{MAX_TEXT_LENGTH}</span>
                            </div>
                          </div>
                        </div>

                       <div>
                         <Label htmlFor="text-input">Text to Digitize</Label>
                         <Textarea
                           id="text-input"
                           placeholder={textShape === "line" 
                             ? "Enter your text here (e.g., company name, logo text, etc.)"
                             : "Enter text for curved layout (e.g., circular logo, badge text, etc.)"
                           }
                           value={textContent}
                           onChange={(e) => setTextContent(e.target.value.slice(0, MAX_TEXT_LENGTH))}
                           className="min-h-[120px] resize-none"
                           maxLength={MAX_TEXT_LENGTH}
                         />
                         <div className="flex justify-between items-center mt-2">
                           <p className="text-sm text-muted-foreground">
                             {textShape === "line" 
                               ? "Perfect for company names, monograms, and simple text designs"
                               : "Ideal for circular logos, badges, and curved text designs"
                             }
                           </p>
                           <span className="text-sm text-muted-foreground">
                             {textContent.length}/{MAX_TEXT_LENGTH}
                           </span>
                         </div>
                       </div>
                     </div>
                   </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Output Formats</CardTitle>
                <CardDescription>Select which embroidery formats to generate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 lg:gap-4">
                  {["DST", "PES", "JEF", "EXP", "VP3", "HUS"].map((format) => (
                    <div key={format} className="flex items-center space-x-2">
                      <Checkbox
                        id={format}
                        checked={outputFormats.includes(format)}
                        onCheckedChange={(checked) => handleFormatChange(format, checked === true)}
                      />
                      <Label htmlFor={format} className="font-mono text-sm">.{format}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Processing Options</CardTitle>
                <CardDescription>Configure conversion settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="priority">Processing Priority</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal (Free)</SelectItem>
                      <SelectItem value="high">High Priority (+$2)</SelectItem>
                      <SelectItem value="express">Express (+$5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={uploadType === "file" ? files.length === 0 : textContent.trim().length === 0}
            >
              {uploadType === "file" 
                ? `Start Conversion (${files.length} file${files.length !== 1 ? 's' : ''})`
                : "Digitize Text"
              }
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Upload;
