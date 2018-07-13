var [fs, path] = [require('fs'), require('path')];
// console.log(process.argv);

// optimist
let args = process.argv.slice(2, process.argv.length);

let [targetPath, text, extension, recur, range] = args;

let ln = 0;
let total = 0;
let leasttotal = 0;
let largetotal = 0;

let fleast = '';
let flarge = '';

range = (range ? range.split('-') : []);
let [n, x] = range;
range = '';

function find(targetPath, deepstr) {
    let report = '';
    let reporttotal = '';

    console.log("|-" + deepstr, targetPath);;

    fs.readdirSync(targetPath).forEach((file) => {
        console.log("|-" + deepstr, targetPath + file);
        if (fs.lstatSync(targetPath + file).isFile()) {
            if (extension && file.match(new RegExp('^.*\.' + extension).length === 0)) {
                return console.log(file + ' : Not Matched');
            }
            let fdata = fs.readFileSync(targetPath + file).toString();
            let data = fdata.match(new RegExp('.*' + text + '.*', 'g'));
            if (data && data.length) {
                if (leasttotal == 0 && largetotal == 0) {
                    leasttotal = data.length;
                    largetotal = data.length;
                }
                if (largetotal < data.length) {
                    largetotal = data.length;
                    flarge = targetPath + file;
                }
                if (leasttotal > data.length) {
                    leasttotal = data.length;
                    fleast = targetPath + file;
                }
                if (n && x) {
                    if (data.length >= +n && data.length <= +x) {
                        range += ""+ targetPath + file + ": " + data.length+"\n";
                    }
                }
                total += data.length;
                report += (++ln) + ' ----------------------------------------------------------\n\n';
                report += "|-" + deepstr + '' + targetPath + file + ' - ' + data.length;
                report += "\n\n------------------------------------------------------------\n\n";
                report += data.join('\n');
                report += "\n\n------------------------------------------------------------\n\n";

                reporttotal += (ln) + ` ${file}\n`;
            }
            return;
        }
        report += (recur == 'true' && file[0] !== '.' ? find(targetPath + file + '/', deepstr + '|- ') : '');
    })
    report += "\n\nTotal file : " + ln + "\nTotal matched: " + total + "\n";
    report += "\n\nTotal files : \n\n" + reporttotal + "\n";
    report += "\n\nTotal least : \n\n" + fleast + ' - ' + leasttotal + "\n";
    report += "\n\nTotal large : \n\n" + flarge + ' - ' + largetotal + "\n";

    if(range){
        report += "\n\nrange files : \n\n" + range + "\n";
    }
    fs.writeFileSync('./report.dat', report);
    return report;
}
console.log(find(targetPath, '- '));