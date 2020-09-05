function readFile(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = function(e) {
      resolve(e.target.result);
    }
    reader.onerror = reject;
    reader.readAsBinaryString(file);
  });
}

function downloadFile(filename, data) {
  if (data) {
    let blob = new Blob([data], {type: 'text/plain'});
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(blob, filename);
    } else {
      let elem = window.document.createElement('a');
      elem.href = window.URL.createObjectURL(blob);
      elem.download = filename;        
      document.body.appendChild(elem);
      elem.click();        
      document.body.removeChild(elem);
    }
  } else {
    alert("No result yet!");
  }
}

function downloadBinaryFile(filename, binaryString) {
  if (binaryString) {
    let l, d, array;
    d = binaryString;
    l = d.length;
    array = new Uint8Array(l);
    for (let i = 0; i < l; i++) {
      array[i] = d.charCodeAt(i);
    }
    let blob = new Blob([array], {type: 'application/octet-stream'});
    // window.location.href = URL.createObjectURL(b);
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(blob, filename);
    } else {
      let elem = window.document.createElement('a');
      elem.href = window.URL.createObjectURL(blob);
      elem.download = filename;        
      document.body.appendChild(elem);
      elem.click();        
      document.body.removeChild(elem);
    }
  } else {
    alert("No result yet!");
  }
}

export {
  readFile,
  downloadFile,
  downloadBinaryFile,
};