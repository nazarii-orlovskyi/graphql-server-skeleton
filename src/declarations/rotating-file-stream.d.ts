declare module 'rotating-file-stream' {
    interface RotatingFileStreamOptions {
        interval: string;
        path: string;
    }

    interface RotatingFileStream {
        (filename: string, options: RotatingFileStreamOptions): any;
    }

    const rfs: RotatingFileStream;

    export = rfs;
}