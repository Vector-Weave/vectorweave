declare module "@canvasjs/react-charts" {
  import * as React from "react";

  export interface CanvasJSChartProps {
    options: any;
    onRef?: (ref: any) => void;
  }

  export const CanvasJSChart: React.FC<CanvasJSChartProps>;

  const CanvasJSReact: {
    CanvasJSChart: typeof CanvasJSChart;
    CanvasJS: any;
  };

  export default CanvasJSReact;
}
