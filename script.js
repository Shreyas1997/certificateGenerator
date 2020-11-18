const userName = document.getElementById("candiName");
const desgName = document.getElementById("candiDesg");
const desgTag = document.getElementById("candiTag");
const issueDate = document.getElementById("iDate");
const submitBtn = document.getElementById("submitBtn");
const { PDFDocument, rgb, degrees } = PDFLib;


submitBtn.addEventListener("click", () => {
    const valName = userName.value;
    const valDesg = desgName.value;
    const valTag = desgTag.value;
    const valDate = issueDate.value;
    if (valName.trim() !== "" && userName.checkValidity() && valDesg.trim() !== "" && desgName.checkValidity() && valDate.trim() !== "" && issueDate.checkValidity() && valTag.trim() !== "" && desgTag.checkValidity()) {
        // console.log(val);
        generatePDF(valName, valDesg.toUpperCase(), valTag, valDate);
    } else {
        userName.reportValidity();
        desgName.reportValidity();
        desgTag.reportValidity();
        issueDate.reportValidity();
    }
});
const generatePDF = async(name, desg, tag, date) => {
    var forDate = moment(date).format("DD MMMM, YYYY");
    const existingPdfBytes = await fetch("./Certificate.pdf").then((res) =>
        res.arrayBuffer()
    );

    // Load a PDFDocument from the existing PDF bytes
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    pdfDoc.registerFontkit(fontkit);


    //get font
    const fontBytes1 = await fetch("./Montserrat-Bold.ttf").then((res) =>
        res.arrayBuffer()
    );
    const fontBytes10 = await fetch("./Montserrat-Regular.ttf").then((res) =>
        res.arrayBuffer()
    );
    const fontBytes11 = await fetch("./Montserrat-SemiBold.ttf").then((res) =>
        res.arrayBuffer()
    );
    const fontBytes2 = await fetch("./times-new-roman.ttf").then((res) =>
        res.arrayBuffer()
    );
    // Embed our custom font in the document
    const Bold = await pdfDoc.embedFont(fontBytes1);
    const Regular = await pdfDoc.embedFont(fontBytes10);
    const SemiBold = await pdfDoc.embedFont(fontBytes11);
    const TReg = await pdfDoc.embedFont(fontBytes2);
    // Get the first page of the document
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    const { width, height } = firstPage.getSize();

    const font1 = 30;
    const font2 = 25;
    const font3 = 20;

    // Draw a string of text diagonally across the first page
    firstPage.drawText(name, {
        x: height - 8 * font1,
        y: 368,
        size: font1,
        font: TReg,
        color: rgb(0, 0, 0),
    });

    firstPage.drawText(desg, {
        x: height - 10 * font2,
        y: 289,
        size: font2,
        font: Bold,
        color: rgb(0.2, 0.84, 0.80),
    });

    firstPage.drawText(tag, {
        x: height - 14 * font3,
        y: 189,
        size: font3,
        font: SemiBold,
        color: rgb(0.2, 0.83, 0.70),
    });

    firstPage.drawText(forDate, {
        x: 562,
        y: 55,
        size: 15,
        font: Bold,
        color: rgb(0, 0, 0),
    });

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
    saveAs(pdfDataUri, "newcertificate.pdf");
};