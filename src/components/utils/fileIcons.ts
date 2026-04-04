const fileIcons: { [key: string]: string } = {
    // Image file types
    jpg: "/jpg-1.svg",
    jpeg: "/jpg-1.svg",
    png: "/png-1.svg",
    gif: "/upload-1.svg", // Assuming upload-1 as a placeholder for unknown image types
    bmp: "/upload-1.svg",
    svg: "/upload-1.svg",
  
    // Document file types
    doc: "/docx.svg",
    docx: "/docx.svg",
    pdf: "/pdf-1.svg",
    txt: "/txt-1.svg",
    rtf: "/word-1.svg", // Use word icon for text-related files
    odt: "/word-1.svg", // OpenOffice/LibreOffice text doc
  
    // Spreadsheet file types
    xls: "/excel-1.svg",
    xlsx: "/excel-1.svg",
    csv: "/excel-1.svg", // Assuming CSV as Excel for simplicity
  
    // Presentation file types
    ppt: "/ppt-1.svg",
    pptx: "/ppt-1.svg",
  
    // Code and development file types
    java: "/java.svg",
    js: "/source-file-1.svg", 
    jsx: "/source-file-1.svg",
    ts: "/source-file-1.svg",
    tsx: "/source-file-1.svg",
    html: "/div-1.svg", // Closest to HTML structure
    css: "/div-1.svg", // Could map to div
    php: "/source-file-1.svg",
    py: "/source-file-1.svg",
    rb: "/source-file-1.svg",
    json: "/source-file-1.svg", 
    xml: "/div-1.svg", 
    m4a: "/mp3-1.svg",
    ogg: "/mp3-1.svg",
  
    // Audio file types
    mp3: "/mp3-1.svg",
    wav: "/mp3-1.svg", // Use the same icon as mp3 for simplicity
    flac: "/mp3-1.svg",
    
    // Video file types
    mp4: "/mp4-1.svg",
    mov: "/mp4-1.svg", // Use mp4 icon for simplicity   
    mkv: "/mp4-1.svg", // Same as mp4 for simplicity
    avi: "/mp4-1.svg", // Same as mp4 for simplicity
    
    // Compressed file types
    zip: "/zip-1.svg",
    rar: "/zip-1.svg", // Use zip for rar
    tar: "/zip-1.svg", // Use zip for tar files
  
    // Folders
    folder: "/folder.svg",
    directory: "/Folder-1.svg",
  
    // Default unknown file types
    default: "/icon-default.svg",
  };
  
  export default fileIcons;
  