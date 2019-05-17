export default function(requestInfo, text) {
  if ('responseHeaders' in requestInfo) {
    requestInfo.responseHeaders.forEach((header) => {
      text = text.replace(`%header:${header.name.toLowerCase()}%`, header.value);
    })
  }

  for (let property in requestInfo) {
    if (!requestInfo.hasOwnProperty(property)) {
      continue;
    }

    if (typeof requestInfo[property] !== 'string' && typeof requestInfo[property] !== 'number') {
      continue;
    }

    text = text.replace(`%${property}%`, requestInfo[property]);
  }

  return text.replace(/%.*?%/g, '<i>undefined</i>');
}
