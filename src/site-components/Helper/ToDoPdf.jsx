import domToPdf from "dom-to-pdf";

export const ToDoPdf = (selector, fileName = 'pdf-file') => {
    var element = document.getElementById(selector);
    var options = {
        filename: 'test.pdf'
    };
    domToPdf(element, options, function (pdf) {
        console.log('done');
    });
};