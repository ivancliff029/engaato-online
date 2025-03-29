"use client"
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ArrowRight, DollarSign, Users, TrendingUp, Star, Award, Zap } from "lucide-react";

export default function AffiliateMarketingCTA() {
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  return (
    <div className="w-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-0.5 sm:p-1 rounded-xl shadow-xl">
      <Card className="w-full overflow-hidden border-0 shadow-lg relative">
        {/* Decorative elements */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1 sm:p-2">
          <div className="flex items-center justify-center bg-yellow-400 text-yellow-800 rounded-full h-6 w-6 sm:h-8 sm:w-8">
            <Star className="h-3 w-3 sm:h-4 sm:w-4" />
          </div>
        </div>
        
        <CardContent className="p-4 sm:p-6">
          <div className="text-center mb-4 sm:mb-6">
            <div className="inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-teal-400 text-white px-3 py-0.5 sm:px-4 sm:py-1 rounded-full mb-2 sm:mb-3">
              <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="text-xs font-bold uppercase tracking-wider">New Program</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
              Boost Your Earnings
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
              Join our affiliate network and earn commissions
            </p>
          </div>

          <div className="flex justify-center mb-4 sm:mb-6">
            <Button
              size="lg"
              className={`relative overflow-hidden group bg-gradient-to-r from-blue-500 to-teal-400 text-white font-bold px-6 py-3 sm:px-8 sm:py-4 rounded-lg sm:rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:from-blue-600 hover:to-teal-500 ${
                isAnimating ? 'animate-pulse' : ''
              }`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={handleClick}
            ><a href="/earn">
               <span className="relative z-10 flex items-center text-sm sm:text-base">
                Start Earning
                <ArrowRight className={`ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-300 ${
                  isHovered ? 'translate-x-1' : ''
                }`} />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </a>
            </Button>
          </div>

          {/* Fixed: Ensuring cards stack by default (mobile) and go horizontal on SM breakpoint and above */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <FeatureCard
              icon={<DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />}
              title="High Commissions"
              description="Up to 30% per sale"
              stat="30%"
              color="bg-yellow-50"
              borderColor="border-yellow-200"
            />
            <FeatureCard
              icon={<Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />}
              title="Global Reach"
              description="Access worldwide"
              stat="5M+"
              color="bg-blue-50"
              borderColor="border-blue-200"
            />
            <FeatureCard
              icon={<TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />}
              title="Growth Tools"
              description="Boost your sales"
              stat="∞"
              color="bg-green-50"
              borderColor="border-green-200"
            />
          </div>

          <div className="mt-4 sm:mt-6 flex items-center justify-center text-xs sm:text-sm text-gray-500">
            <Award className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-purple-500" />
            <span>Top performers earn $10k+ monthly</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function FeatureCard({ icon, title, description, stat, color, borderColor }) {
  return (
    <div className={`${color} ${borderColor} border rounded-lg sm:rounded-xl p-3 sm:p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5`}>
      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <div className="flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-md sm:rounded-lg bg-white shadow-sm">
          {icon}
        </div>
        <span className="text-lg sm:text-xl font-bold text-gray-800">{stat}</span>
      </div>
      <div>
        <h3 className="font-medium sm:font-semibold text-sm sm:text-base text-gray-900 mb-0.5 sm:mb-1">{title}</h3>
        <p className="text-xs sm:text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}