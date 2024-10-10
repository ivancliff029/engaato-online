import { useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { ArrowRight, DollarSign, Users, TrendingUp } from "lucide-react"

export default function AffiliateMarketingCTA() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="w-full bg-gradient-to-b mt-5 from-purple-600 via-pink-500 to-orange-400 p-4">
      <Card className="w-full overflow-hidden shadow-md">
        <CardContent className="p-4">
          <h2 className="text-lg font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
            Earn with Affiliate Marketing
          </h2>
          <p className="mt-2 text-sm text-center text-gray-600">
           Resell items from our Store and earn some Cash
          </p>
          <div className="mt-4 flex justify-center">
            <Button
              size="sm"
              className="w-full group bg-gradient-to-r from-blue-500 to-teal-400 text-white transition-all duration-300 ease-in-out transform hover:scale-105"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              Start Now
              <ArrowRight className={`ml-2 h-3 w-3 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
            </Button>
          </div>
          <div className="mt-4 space-y-3">
            <FeatureCard
              icon={<DollarSign className="h-4 w-4 text-yellow-500" />}
              title="High Commissions"
              description="Up to 30% per referral"
              color="bg-yellow-100"
            />
            <FeatureCard
              icon={<Users className="h-4 w-4 text-blue-500" />}
              title="Large Network"
              description="Global customer base"
              color="bg-blue-100"
            />
            <FeatureCard
              icon={<TrendingUp className="h-4 w-4 text-green-500" />}
              title="Growth Potential"
              description="Unlimited possibilities"
              color="bg-green-100"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  color: string
}

function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  return (
    <div className={`${color} rounded-lg p-2 flex items-center space-x-2`}>
      <div className="flex-shrink-0">
        <div className="flex items-center justify-center h-8 w-8 rounded-md bg-white">
          {icon}
        </div>
      </div>
      <div className="flex-grow">
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        <p className="text-xs text-gray-600">{description}</p>
      </div>
    </div>
  )
}