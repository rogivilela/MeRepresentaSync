
require('./database');

const Person = require('./models/Person');
const Proposal = require('./models/Proposal');
const Deputado = require('./models/Deputado');
const sync = require('./jobs/Sync');
// import * as sync from './jobs/Sync';




console.log('Starting scheduler');
sync.run();

// ========
// teste();
// async function teste() {
//     if (1 == 1);
//     var person = await Person.findOne({
//         where: { Id: '8275cfd0-8f40-11eb-89aa-63c8d81c7323' }
//     });
//     if (1 == 1);
//     var proposal = await Proposal.findOne({
//         where: { Id: '8275cfd0-8f40-11eb-89aa-63c8d81c7322' }
//     })

//     var proposal = await person.addProposalsFK(proposal);
//     if (1 == 1);
//     // person.addProl(proposal);
//     // if (1 == 1);
//     // var person = await Person.findOne({
//     //     where: { Id: '8275cfd0-8f40-11eb-89aa-63c8d81c7323' }, include: 'ProposalsFK'
//     // });
//     if (1 == 1);

// }