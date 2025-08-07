import { formatNumber } from '@/common/lib/format'

import { generateColors } from './colors'

export interface PiePoint extends Highcharts.Point {
  sliced: boolean
  slice(
    sliced?: boolean,
    redraw?: boolean,
    animation?: boolean | Highcharts.AnimationOptionsObject
  ): void
}
export interface PieData {
  id: number
  name: string
  summa: number
}

export interface PieChartPoint extends Omit<PiePoint, 'color' | 'y'>, PieData {}

export const getRegionChartOptions = ({
  items,
  onSelect
}: {
  items: PieData[]
  onSelect: (item: PieData) => void
}): Highcharts.Options => {
  const colors = generateColors(items.length)
  return {
    chart: {
      type: 'pie',
      height: 300,
      backgroundColor: 'transparent'
    },
    title: {
      text: ''
    },
    credits: {
      enabled: false
    },
    tooltip: {
      formatter: function () {
        return `<span style="display: inline-block; width: 8px; height: 8px; border-radius: 100%; background-color: ${this.color}"></span> <small>${this.name}</small></br> ${formatNumber(this.y ?? 0)}`
      },
      useHTML: true
    },
    legend: {
      enabled: false
    },
    plotOptions: {
      pie: {
        borderWidth: 5,
        slicedOffset: 10,
        states: {
          select: {
            enabled: false
          },
          hover: {
            enabled: true,
            brightness: 0,
            halo: {
              size: 0
            }
          },
          inactive: {
            enabled: true,
            opacity: 1
          }
        },
        cursor: 'pointer',
        colors,
        dataLabels: [
          {
            enabled: true,
            distance: 20,
            formatter: function () {
              return formatNumber(this.y ?? 0)
            },
            style: {
              color: 'currentColor'
            }
          }
        ],
        point: {
          events: {
            click: function () {
              const point = this as PieChartPoint
              onSelect(point)
            },
            mouseOver: function () {
              const point = this as PieChartPoint
              if (!point.sliced) {
                point.slice(true, true, {
                  duration: 200,
                  easing: 'easeOutBounce'
                })
              }
            },
            mouseOut: function () {
              const point = this as PieChartPoint
              if (point.sliced) {
                point.slice(false, true, {
                  duration: 200,
                  easing: 'easeOutBounce'
                })
              }
            }
          }
        },
        showInLegend: true
      }
    },
    series: [
      {
        type: 'pie',
        data: items.map((item) => ({
          ...item,
          id: item.id.toString(),
          y: item.summa
        }))
      }
    ]
  }
}
