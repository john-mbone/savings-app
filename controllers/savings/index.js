const { fDateTimeSuffixShort } = require("../../utils/formatTime")




exports.save = async (req, res) => {
    try {
        const today = fDateTimeSuffixShort(new Date())
        res.json({ status: true, message: 'You have successfully saved.' ,today})
    } catch (error) {

    }
}