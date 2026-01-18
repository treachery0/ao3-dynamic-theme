export function downloadFile(data: BlobPart, filename: string) {
    const blob = new Blob([data]);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}