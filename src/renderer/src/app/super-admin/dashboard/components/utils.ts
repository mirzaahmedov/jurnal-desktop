export interface PiePoint extends Highcharts.Point {
  sliced: boolean
  slice(
    sliced?: boolean,
    redraw?: boolean,
    animation?: boolean | Highcharts.AnimationOptionsObject
  ): void
}
export interface KassaPieData {
  status_id: number
  color: string
  name: string
  y: number
  percent: number
}

export interface StatusPiePoint extends Omit<PiePoint, 'color' | 'y'>, KassaPieData {}

export const getKassaChartOptions = ({
  data,
  onSelect
}: {
  data: KassaPieData[]
  onSelect: (item: KassaPieData) => void
}): Highcharts.Options => ({
  chart: {
    type: 'pie',
    backgroundColor: 'transparent'
  },
  title: {
    text: ''
  },
  credits: {
    enabled: false
  },
  tooltip: {
    format:
      '<span style="display: inline-block; width: 8px; height: 8px; border-radius: 100%; background-color: {point.color}"></span> <small>{point.name}</small></br> {point.y} ({point.percent}%)',
    useHTML: true
  },
  legend: {
    itemStyle: {
      color: 'currentColor'
    },
    itemHoverStyle: {
      color: 'currentColor'
    }
  },
  plotOptions: {
    pie: {
      borderWidth: 5,
      borderColor: 'var(--mybackground)',
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
      dataLabels: [
        {
          enabled: true,
          distance: 20,
          format: '{point.y}',
          style: {
            color: 'currentColor'
          }
        }
      ],
      point: {
        events: {
          click: function () {
            const point = this as StatusPiePoint
            onSelect(point)
          },
          mouseOver: function () {
            const point = this as StatusPiePoint
            if (!point.sliced) {
              point.slice(true, true, {
                duration: 200,
                easing: 'easeOutBounce'
              })
            }
          },
          mouseOut: function () {
            const point = this as StatusPiePoint
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
      name: 'Percentage',
      joinBy: ['status_id', 'status_id'],
      data
    }
  ]
})
