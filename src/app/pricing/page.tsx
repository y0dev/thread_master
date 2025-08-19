import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Crown, Building } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Hobby",
      icon: <Check className="h-6 w-6" />,
      price: "Free",
      description: "Perfect for trying out embroidery digitization",
      features: [
        "5 conversions per month",
        "DST format only", 
        "Standard processing speed",
        "Basic support",
        "Max file size: 5MB"
      ],
      buttonText: "Get Started",
      popular: false
    },
    {
      name: "Pro",
      icon: <Zap className="h-6 w-6" />,
      price: "$19",
      period: "/month",
      description: "For small businesses and frequent users",
      features: [
        "100 conversions per month",
        "All output formats (DST, PES, JEF, EXP, VP3, HUS)",
        "Priority processing",
        "Email support",
        "Max file size: 25MB",
        "Batch processing",
        "Download history"
      ],
      buttonText: "Start Pro Trial",
      popular: true
    },
    {
      name: "Enterprise",
      icon: <Building className="h-6 w-6" />,
      price: "$99", 
      period: "/month",
      description: "For large teams and commercial operations",
      features: [
        "Unlimited conversions",
        "All output formats",
        "Express processing (2x faster)",
        "Priority support & phone support",
        "Max file size: 100MB",
        "Advanced batch processing",
        "API access",
        "Custom integrations",
        "Dedicated account manager"
      ],
      buttonText: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your embroidery digitization needs. 
            Scale up or down anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={plan.name} 
              className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="gap-1">
                    <Crown className="h-3 w-3" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 text-primary w-fit">
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-base">
                  {plan.description}
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-muted-foreground">{plan.period}</span>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                  size="lg"
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-8">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            <div>
              <h4 className="font-semibold mb-2">What file formats do you accept?</h4>
              <p className="text-muted-foreground text-sm">
                We accept PNG, JPG, and SVG files up to the size limit of your plan.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">How long does processing take?</h4>
              <p className="text-muted-foreground text-sm">
                Standard processing is 5-10 minutes, priority is 2-5 minutes, and express is under 2 minutes.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Can I cancel anytime?</h4>
              <p className="text-muted-foreground text-sm">
                Yes, you can cancel your subscription at any time. No long-term commitments.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Do you offer refunds?</h4>
              <p className="text-muted-foreground text-sm">
                We offer a 30-day money-back guarantee for all paid plans.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
