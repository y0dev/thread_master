'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Download, Eye, Settings, Zap, Play, Pause } from "lucide-react";
import Link from "next/link";

const Preview = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [stitchSpeed, setStitchSpeed] = useState(1);

  // Mock data for preview
  const designInfo = {
    name: "Company Logo Design",
    type: "Text",
    text: "ACME Corp",
    shape: "line",
    dimensions: "100mm x 15mm",
    stitchCount: 1247,
    colors: ["#FF0000", "#000000"],
    estimatedTime: "8 minutes",
    formats: ["DST", "PES", "JEF"]
  };

  const stitchingSteps = [
    { step: 1, color: "#FF0000", description: "Red outline", stitches: 423 },
    { step: 2, color: "#000000", description: "Black fill", stitches: 824 }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <span className="text-primary-foreground font-bold">E</span>
            </div>
            <span className="text-xl font-bold">EmbroideryForge</span>
          </div>
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            <Link href="/pricing" className="text-muted-foreground hover:text-foreground">Pricing</Link>
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">Dashboard</Link>
            <Button variant="outline" size="sm" className="lg:text-base lg:px-4 lg:py-2">Sign In</Button>
            <Button size="sm" className="lg:text-base lg:px-4 lg:py-2">Get Started</Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6 lg:mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/upload">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Upload
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">{designInfo.name}</h1>
                <p className="text-muted-foreground">Preview your embroidery design before download</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Preview Area */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Design Preview
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsPlaying(!isPlaying)}
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        {isPlaying ? "Pause" : "Play"}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Preview Canvas */}
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                    <div className="text-center">
                      <div className="relative">
                        {/* Mock embroidery preview */}
                        <div className="text-6xl font-bold text-red-500 mb-2" style={{ fontFamily: 'serif' }}>
                          ACME
                        </div>
                        <div className="text-4xl font-bold text-black" style={{ fontFamily: 'serif' }}>
                          Corp
                        </div>
                        
                        {/* Stitch indicators */}
                        <div className="absolute inset-0 pointer-events-none">
                          {Array.from({ length: 20 }).map((_, i) => (
                            <div
                              key={i}
                              className="absolute w-1 h-1 bg-primary rounded-full opacity-30"
                              style={{
                                left: `${10 + (i * 4)}%`,
                                top: `${30 + Math.sin(i) * 10}%`,
                                animationDelay: `${i * 100}ms`
                              }}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-4 text-sm text-muted-foreground">
                        Interactive embroidery preview
                      </div>
                    </div>
                  </div>
                  
                  {/* Controls */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">Speed:</span>
                      <div className="flex items-center gap-2">
                        {[0.5, 1, 2, 4].map((speed) => (
                          <Button
                            key={speed}
                            variant={stitchSpeed === speed ? "default" : "outline"}
                            size="sm"
                            onClick={() => setStitchSpeed(speed)}
                          >
                            {speed}x
                          </Button>
                        ))}
                      </div>
                    </div>
                    <Badge variant="secondary">
                      <Zap className="h-3 w-3 mr-1" />
                      {designInfo.stitchCount} stitches
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Stitching Steps */}
              <Card>
                <CardHeader>
                  <CardTitle>Stitching Sequence</CardTitle>
                  <CardDescription>Step-by-step embroidery process</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stitchingSteps.map((step) => (
                      <div key={step.step} className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                            {step.step}
                          </div>
                          <div
                            className="w-6 h-6 rounded-full border-2 border-border"
                            style={{ backgroundColor: step.color }}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{step.description}</p>
                          <p className="text-sm text-muted-foreground">{step.stitches} stitches</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Design Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Design Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Type</label>
                    <p className="font-medium">{designInfo.type}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Text</label>
                    <p className="font-medium">"{designInfo.text}"</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Layout</label>
                    <p className="font-medium capitalize">{designInfo.shape}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Dimensions</label>
                    <p className="font-medium">{designInfo.dimensions}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Colors</label>
                    <div className="flex gap-2 mt-1">
                      {designInfo.colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 rounded-full border-2 border-border"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Estimated Time</label>
                    <p className="font-medium">{designInfo.estimatedTime}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Download Options */}
              <Card>
                <CardHeader>
                  <CardTitle>Download Files</CardTitle>
                  <CardDescription>Available embroidery formats</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="all">All Formats</TabsTrigger>
                      <TabsTrigger value="single">Individual</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="all" className="mt-4">
                      <Button className="w-full mb-4">
                        <Download className="h-4 w-4 mr-2" />
                        Download All (.zip)
                      </Button>
                      <p className="text-sm text-muted-foreground">
                        Includes: {designInfo.formats.join(", ")} formats
                      </p>
                    </TabsContent>
                    
                    <TabsContent value="single" className="mt-4 space-y-2">
                      {designInfo.formats.map((format) => (
                        <Button key={format} variant="outline" className="w-full justify-start">
                          <Download className="h-4 w-4 mr-2" />
                          .{format}
                        </Button>
                      ))}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="space-y-3">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/upload">Edit Design</Link>
                </Button>
                <Button variant="outline" className="w-full">
                  Save to Library
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
