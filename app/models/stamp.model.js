class Stamp {
    constructor(stamp) {
        this.code = '' + stamp.code;
        this.stampTemplateId = Math.trunc(stamp.stampTemplateId);
        this.activityTypeId = Math.trunc(stamp.activityTypeId);
        this.picPath = '' + stamp.picPath;
        this.points = Math.trunc(stamp.point);
        this.claimedByNumber = Math.trunc(stamp.claimedByNumber);
        this.claimedTs = new Date(stamp.claimedTs);
        this.printCount = Math.trunc(stamp.printCount);
        this.lastPrintedTs = new Date(stamp.lastPrintedTs);
    }
}

module.exports = Stamp;