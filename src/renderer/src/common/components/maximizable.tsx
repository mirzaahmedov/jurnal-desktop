// import { type HTMLAttributes, useState } from 'react'

// import { cn } from '../lib/utils'

// export const Maximizable = ({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) => {
//   const [maximized, setMaximized] = useState(false)
//   return (
//     <div
//       {...props}
//       className={cn(
//         'flex-1 relative min-h-0 flex flex-col',
//         maximized && 'fixed top-0 left-0 bottom-0 right-0 z-100 bg-white',
//         className
//       )}
//     >
//       {children}
//     </div>
//   )
// }

//
// <Button
// size="icon"
// variant="outline"
// className="fixed bottom-10 right-16 z-100"
// onClick={() => setMaximized((prev) => !prev)}
// >
// {maximized ? <Minimize className="btn-icon" /> : <Maximize className="btn-icon" />}
// </Button>
//
