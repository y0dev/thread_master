import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Upload, Download, Zap, Shield, Globe, Star } from "lucide-react";
import Link from "next/link";

const Index = () => {
  const features = [
    {
      icon: <Upload className="h-8 w-8" />,
      title: "Easy Upload",
      description: "Drag and drop your PNG, JPG, or SVG files"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Fast Processing", 
      description: "Get your embroidery files in minutes, not hours"
    },
    {
      icon: <Download className="h-8 w-8" />,
      title: "Multiple Formats",
      description: "Download in DST, PES, JEF, EXP, VP3, HUS formats"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure & Private",
      description: "Your designs are processed securely and privately"
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Open Source",
      description: "Self-host or use our managed service"
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: "High Quality",
      description: "Professional-grade digitization algorithms"
    }
  ];

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="py-12 lg:py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 lg:mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Transform Your Artwork Into Professional Embroidery Files
          </h1>
          <p className="text-lg lg:text-xl text-muted-foreground mb-6 lg:mb-8 max-w-2xl mx-auto">
            Upload your designs or create text embroidery and get high-quality machine files in minutes. 
            Open-source, self-hostable, and ready for commercial use.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center">
            <Button size="lg" className="gap-2" asChild>
              <Link href="/upload">
                Start Converting
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose EmbroideryForge?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The most advanced open-source embroidery digitization platform
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 text-primary w-fit">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to get started?</CardTitle>
              <CardDescription className="text-base">
                Join thousands of users who trust EmbroideryForge for their digitization needs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button size="lg" className="w-full gap-2" asChild>
                <Link href="/upload">
                  Upload Your First Design
                  <Upload className="h-4 w-4" />
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground">
                Free tier available • No credit card required
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 EmbroideryForge. Open source embroidery digitization.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
