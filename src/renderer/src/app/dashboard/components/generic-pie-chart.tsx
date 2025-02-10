import type { PieSectorDataItem } from 'recharts/types/polar/Pie'

import { useId } from 'react'

import { formatNumber } from '@renderer/common/lib/format'
import { millify } from 'millify'
import { useTranslation } from 'react-i18next'
import { Label, Pie, PieChart, Sector } from 'recharts'

import {
  type ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent
} from '@/common/components/ui/chart'

export const predefinedColors = [
  '#007BFF', // Blue (Accent)
  '#28A745', // Green
  '#FFC107', // Yellow
  '#DC3545', // Red
  '#6610F2', // Purple
  '#17A2B8', // Cyan
  '#FF851B', // Orange
  '#20C997', // Teal
  '#E83E8C', // Pink
  '#6C757D' // Gray
]

export const getRandomColor = (existingColors: string[]) => {
  let color: string
  do {
    const hue = Math.floor(Math.random() * 360) // Full color range
    const saturation = Math.floor(Math.random() * 30) + 60 // 60-90%
    const lightness = Math.floor(Math.random() * 30) + 40 // 40-70%
    color = `hsl(${hue}, ${saturation}%, ${lightness}%)`
  } while (existingColors.includes(color)) // Ensure uniqueness
  return color
}

export const getPieChartColors = (count: number) => {
  const colors = Array.from<string>({ length: count })

  for (let i = 0; i < colors.length; i++) {
    if (i < predefinedColors.length) {
      colors[i] = predefinedColors[i]
      continue
    }
    colors[i] = getRandomColor(colors)
  }

  return colors
}

export interface GenericPieChartData {
  main_schet_id: number
  fill: string
  summa: number
}
export interface GenericPieChartProps {
  data: GenericPieChartData[]
  config: ChartConfig
  total: number
}
export const GenericPieChart = ({ data, config, total }: GenericPieChartProps) => {
  const id = useId()

  const { t, i18n } = useTranslation()

  return (
    <>
      <ChartStyle
        id={id}
        config={config}
      />
      <ChartContainer
        id={id}
        config={config}
        className="mx-auto aspect-square w-full max-w-[300px]"
      >
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Pie
            label={(props) => formatNumber(props.summa ?? 0)}
            data={data}
            dataKey="summa"
            nameKey="main_schet_id"
            innerRadius={60}
            strokeWidth={2}
            activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
              <g>
                <Sector
                  {...props}
                  outerRadius={outerRadius + 10}
                />
                <Sector
                  {...props}
                  outerRadius={outerRadius + 25}
                  innerRadius={outerRadius + 12}
                />
              </g>
            )}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-base font-bold"
                      >
                        {total > 1000000
                          ? millify(total, {
                              space: true,
                              units: ['', 'ming', 'mln', 'mlrd', 'tril'],
                              locales: i18n.language
                            })
                          : formatNumber(total)}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        {t('sum')}
                      </tspan>
                    </text>
                  )
                }
                return null
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </>
  )
}
