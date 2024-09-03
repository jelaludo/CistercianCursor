declare module 'roughjs/bundled/rough.esm' {
    const rough: {
        canvas: (canvas: HTMLCanvasElement) => {
            line: (x1: number, y1: number, x2: number, y2: number, options?: any) => void;
            rectangle: (x: number, y: number, width: number, height: number, options?: any) => void;
            ellipse: (x: number, y: number, width: number, height: number, options?: any) => void;
            circle: (x: number, y: number, diameter: number, options?: any) => void;
            linearPath: (points: number[][], options?: any) => void;
            polygon: (points: number[][], options?: any) => void;
            arc: (x: number, y: number, width: number, height: number, start: number, stop: number, closed?: boolean, options?: any) => void;
            curve: (points: number[][], options?: any) => void;
            path: (d: string, options?: any) => void;
        };
    };
    export default rough;
}