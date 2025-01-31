const Graphs = require("../models/Graphs");
const Tickets = require("../models/Tickets");

exports.getStatus = async (req, res) => {

    try {
        let dataOpen = await Tickets.findAndCountAll( { where: {status: 'open'} } );
        let dataInProgress = await Tickets.findAndCountAll( { where: {status: 'in_progress'} } );
        let dataClosed = await Tickets.findAndCountAll( { where: {status: 'closed'} } );

        //{status: {[Op.in]: ['open', 'in_progress', 'closed']}}

        if (dataOpen && dataInProgress && dataClosed) {
            console.log("test riuscito");
            res.json({
                count_open: dataOpen,
                count_in_progress: dataInProgress,
                count_closed: dataClosed
            })
        }

    } catch (error) {
        console.log("test non riuscito");
        return res.status(500).json({ error: "Errore del server!" });   
    }
};
