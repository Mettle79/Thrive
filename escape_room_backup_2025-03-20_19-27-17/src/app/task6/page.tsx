"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Shield, QrCode } from "lucide-react"
import Link from "next/link"
import { QRCodeSVG } from "qrcode.react"

interface MenuItem {
  name: string
  price: string
  description: string
}

interface Menu {
  name: string
  description: string
  qrCodeUrl: string
  isSafe: boolean
  warningSigns: string[]
  items: MenuItem[]
}

export default function QRCodeChallenge() {
  const [selectedMenus, setSelectedMenus] = useState<Menu[]>([])
  const [showResult, setShowResult] = useState(false)

  const menus: Menu[] = [
    {
      name: "The Coffee House",
      description: "A cozy café serving freshly brewed coffee and homemade pastries. Located at 123 High Street.",
      qrCodeUrl: "https://coffeehouse.com/menu (SAFE)",
      isSafe: true,
      warningSigns: [],
      items: [
        { name: "Espresso", price: "£2.50", description: "Single shot of premium Italian coffee" },
        { name: "Cappuccino", price: "£3.20", description: "Espresso topped with foamy milk" },
        { name: "Latte", price: "£3.50", description: "Espresso with steamed milk" },
        { name: "Americano", price: "£2.80", description: "Double shot of espresso with hot water" },
        { name: "Flat White", price: "£3.30", description: "Espresso with velvety micro-foam" }
      ]
    },
    {
      name: "Coffee & More",
      description: "Visit our website for amazing deals and special offers!",
      qrCodeUrl: "https://coffee-and-more.com/menu (MALICIOUS)",
      isSafe: false,
      warningSigns: [
        "Generic name",
        "Suspicious description urging website visit",
        "No specific location mentioned",
        "Unrealistic prices",
        "Spelling mistakes in menu items"
      ],
      items: [
        { name: "Expresso", price: "£1.99", description: "Our signature blend" },
        { name: "Cappuchino", price: "£1.99", description: "Classic Italian style" },
        { name: "Latté", price: "£1.99", description: "Smooth and creamy" },
        { name: "Americano", price: "£1.99", description: "Double shot expresso" },
        { name: "Flat White", price: "£1.99", description: "Micro-foam milk" }
      ]
    },
    {
      name: "The Artisan Café",
      description: "All items just £2.99! Visit our website for the best coffee deals in town.",
      qrCodeUrl: "https://artisan-cafe.com/menu (MALICIOUS)",
      isSafe: false,
      warningSigns: [
        "Prices too good to be true",
        "No location information",
        "Generic menu items",
        "All items same price",
        "Spelling mistakes in descriptions"
      ],
      items: [
        { name: "Espresso", price: "£2.99", description: "Premium cofee" },
        { name: "Cappuccino", price: "£2.99", description: "Classic Italian stile" },
        { name: "Latte", price: "£2.99", description: "Smooth and creemy" },
        { name: "Americano", price: "£2.99", description: "Double shot expresso" },
        { name: "Flat White", price: "£2.99", description: "Micro-foam milk" }
      ]
    },
    {
      name: "Café Delight",
      description: "Authentic Italian coffee and fresh pastries. Located at 456 Market Street.",
      qrCodeUrl: "https://cafedelight.com/menu (SAFE)",
      isSafe: true,
      warningSigns: [],
      items: [
        { name: "Espresso", price: "£2.60", description: "Single shot of premium Italian coffee" },
        { name: "Cappuccino", price: "£3.30", description: "Espresso topped with foamy milk" },
        { name: "Latte", price: "£3.60", description: "Espresso with steamed milk" },
        { name: "Americano", price: "£2.90", description: "Double shot of espresso with hot water" },
        { name: "Flat White", price: "£3.40", description: "Espresso with velvety micro-foam" }
      ]
    },
    {
      name: "Quick Coffee Stop",
      description: "Best coffee in town! Click here for our secret menu and exclusive offers!",
      qrCodeUrl: "https://quick-coffee-stop.com/menu (MALICIOUS)",
      isSafe: false,
      warningSigns: [
        "No specific location",
        "Mention of 'secret menu'",
        "Suspicious pricing",
        "Spelling mistakes in menu items"
      ],
      items: [
        { name: "Expresso", price: "£1.50", description: "Our signature blend" },
        { name: "Cappuchino", price: "£1.99", description: "Extra large size" },
        { name: "Latté", price: "£2.99", description: "Secret recipe" },
        { name: "Americano", price: "£3.99", description: "Exclusive blend" },
        { name: "Flat White", price: "£4.99", description: "Limited time offer" }
      ]
    },
    {
      name: "Coffee Corner",
      description: "Limited time offer! All coffees 50% off! Visit our website now!",
      qrCodeUrl: "https://coffee-corner.com/menu (MALICIOUS)",
      isSafe: false,
      warningSigns: [
        "Generic name",
        "No location information",
        "Unrealistic discounts",
        "Spelling mistakes in menu items"
      ],
      items: [
        { name: "Expresso", price: "£1.25", description: "Our special blend" },
        { name: "Cappuchino", price: "£1.50", description: "Extra large size" },
        { name: "Latté", price: "£1.75", description: "Special recipe" },
        { name: "Americano", price: "£2.00", description: "Exclusive blend" },
        { name: "Flat White", price: "£2.25", description: "Limited time only" }
      ]
    }
  ]

  const handleMenuSelect = (menu: Menu) => {
    if (selectedMenus.length < 2 && !selectedMenus.find(m => m.name === menu.name)) {
      const newSelectedMenus = [...selectedMenus, menu]
      setSelectedMenus(newSelectedMenus)
      
      if (newSelectedMenus.length === 2) {
        setShowResult(true)
      }
    }
  }

  const handleReset = () => {
    setSelectedMenus([])
    setShowResult(false)
  }

  const isSelectionCorrect = selectedMenus.length === 2 && selectedMenus.every(menu => menu.isSafe)

  return (
    <div className="flex flex-1 flex-col bg-black p-4 text-orange-500">
      <div className="mx-auto w-full max-w-4xl">
        <Card className="border-orange-500 bg-black">
          <CardContent className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <QrCode className="h-8 w-8 text-orange-500" />
                <h1 className="text-2xl font-bold">QR Code Security Challenge</h1>
              </div>
              <div className="text-sm text-orange-400">
                Selected: {selectedMenus.length}/2 menus
              </div>
            </div>

            <p className="mb-6 text-orange-200">
              Select the two legitimate menus by examining their QR codes and descriptions. Look for warning signs like:
            </p>

            <ul className="mb-6 list-inside list-disc space-y-2 text-orange-200">
              <li>Spelling mistakes or typos</li>
              <li>Unrealistic prices</li>
              <li>Missing location information</li>
              <li>Generic descriptions</li>
              <li>QR codes that appear to be pasted over or tampered with - always check if the menu feels different from the QR code</li>
            </ul>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {menus.map((menu) => (
                <Card
                  key={menu.name}
                  className={`cursor-pointer border transition-colors bg-amber-900/80 ${
                    selectedMenus.find(m => m.name === menu.name)
                      ? "border-orange-500 bg-orange-700/90"
                      : "border-orange-500/50 hover:border-orange-500"
                  }`}
                  onClick={() => handleMenuSelect(menu)}
                >
                  <CardContent className="p-4">
                    <div className="mb-4 flex justify-center">
                      <div className="rounded-lg bg-amber-800/60 p-2">
                        <QRCodeSVG value={menu.qrCodeUrl} size={150} />
                      </div>
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-amber-50">{menu.name}</h3>
                    <p className="text-sm text-amber-100 mb-4">{menu.description}</p>
                    <div className="space-y-2">
                      {menu.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <div>
                            <span className="font-medium text-amber-50">{item.name}</span>
                            <span className="text-amber-200 ml-2">- {item.description}</span>
                          </div>
                          <span className="font-mono text-amber-100">{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {showResult && (
              <div className="mt-6 rounded-lg border border-orange-500 bg-orange-900/20 p-4">
                {isSelectionCorrect ? (
                  <div className="flex flex-col items-center">
                    <div className="mb-4 flex items-center gap-2 text-green-400">
                      <Shield className="h-6 w-6" />
                      <h2 className="text-xl font-bold">Correct Selection!</h2>
                    </div>
                    <p className="mb-4 text-center text-orange-200">
                      You've successfully identified both legitimate menus. Well done!
                    </p>
                    <Link href="/task7">
                      <Button className="bg-orange-600 hover:bg-orange-700">Proceed to Next Task</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="mb-4 flex items-center gap-2 text-red-400">
                      <AlertCircle className="h-6 w-6" />
                      <h2 className="text-xl font-bold">Incorrect Selection</h2>
                    </div>
                    <p className="mb-4 text-center text-orange-200">
                      You've selected one or more unsafe menus. Here are the warning signs to look for:
                    </p>
                    <ul className="mb-4 list-inside list-disc space-y-2 text-orange-200">
                      {selectedMenus
                        .filter(menu => !menu.isSafe)
                        .map(menu => (
                          <li key={menu.name}>
                            <span className="font-bold">{menu.name}:</span> {menu.warningSigns.join(", ")}
                          </li>
                        ))}
                    </ul>
                    <Button onClick={handleReset} className="bg-orange-600 hover:bg-orange-700">
                      Try Again
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 