import  AffiliateMarketingCTA  from "../components/Earn";
import { Check, ChevronRight, HelpCircle, Users, Award, DollarSign, FileText, Rocket } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

export default function EarnPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 mt-10">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
            Become an Affiliate Partner
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our affiliate program and earn substantial commissions by promoting products you believe in.
          </p>
          
          {/* CTA Component */}
          <AffiliateMarketingCTA />
        </div>

        {/* How It Works Section */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StepCard 
              number="1" 
              title="Sign Up" 
              description="Complete our simple application form to join our affiliate network."
              icon={<FileText className="h-6 w-6 text-blue-500" />}
            />
            <StepCard 
              number="2" 
              title="Promote" 
              description="Share your unique affiliate links through your website, social media, or email."
              icon={<Rocket className="h-6 w-6 text-purple-500" />}
            />
            <StepCard 
              number="3" 
              title="Earn" 
              description="Receive up to 30% commission on every sale made through your links."
              icon={<DollarSign className="h-6 w-6 text-green-500" />}
            />
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Program Benefits</h2>
          
          <Card>
            <CardContent className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <BenefitItem text="Industry-leading 30% commission rate" />
                <BenefitItem text="Reliable monthly payments" />
                <BenefitItem text="Advanced tracking dashboard" />
                <BenefitItem text="Marketing materials provided" />
                <BenefitItem text="Dedicated affiliate manager" />
                <BenefitItem text="Performance-based bonuses" />
                <BenefitItem text="90-day cookie duration" />
                <BenefitItem text="Comprehensive reporting tools" />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* FAQ Section */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <FaqItem 
              question="Who can join the affiliate program?" 
              answer="Anyone with an online presence can join our program. This includes bloggers, content creators, influencers, website owners, and email marketers." 
            />
            <FaqItem 
              question="How much can I earn?" 
              answer="Earnings depend on your reach and engagement. Our top affiliates earn 200,000 Ugx + monthly, with an average commission of 30% per sale." 
            />
            <FaqItem 
              question="When and how do I get paid?" 
              answer="We process payments monthly for all earnings over 50,000 Ugx. You can choose to receive payments via Bank Payments or mobile money." 
            />
            <FaqItem 
              question="What support do you provide?" 
              answer="You'll have access to marketing materials, a dedicated affiliate manager, performance tips, and a comprehensive reporting dashboard." 
            />
          </div>
        </section>

        {/* Application Section */}
        <section className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Ready to Start Earning?</h2>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Join thousands of successful affiliates who are already earning with us.
          </p>
          
          <Button size="lg" className="bg-gradient-to-r from-blue-500 to-teal-400 text-white hover:from-blue-600 hover:to-teal-500">
            <a href="/earn/apply">Apply Now <ChevronRight className="ml-2 h-4 w-4" /></a>
          </Button>
          
          <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
            <HelpCircle className="h-4 w-4 mr-2" />
            <span>Have questions? <a href="/contact" className="text-blue-500 hover:underline">Contact our team</a></span>
          </div>
        </section>
      </div>
    </div>
  );
}

// Helper Components
function StepCard({ number, title, description, icon }) {
  return (
    <Card className="border-2 hover:border-blue-200 transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-bold">
              {number}
            </div>
            <CardTitle className="text-xl">{title}</CardTitle>
          </div>
          <div>{icon}</div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-gray-600">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}

function BenefitItem({ text }) {
  return (
    <div className="flex items-start">
      <div className="flex-shrink-0 mt-1">
        <Check className="h-5 w-5 text-green-500" />
      </div>
      <span className="ml-2 text-gray-700">{text}</span>
    </div>
  );
}

function FaqItem({ question, answer }) {
  return (
    <Card className="hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-start">
          <HelpCircle className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0 mt-1" />
          {question}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{answer}</p>
      </CardContent>
    </Card>
  );
}