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

export {
  readFile
};