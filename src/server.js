
require('./database');

const Person = require('./models/Person');
const Proposal = require('./models/Proposal');
const Deputado = require('./models/Deputado');
teste();
async function teste() {
    // if (1 == 1);
    // var person = await Person.findOne({
    //     where: { Id: '8275cfd0-8f40-11eb-89aa-63c8d81c7323' }
    // });
    // if (1 == 1);
    // var proposal = await Proposal.findOne({
    //     where: { Id: '8275cfd0-8f40-11eb-89aa-63c8d81c7322' }
    // })

    // var proposal = await person.createProposalsFK({ Type: 'PL', Number: '233', Year: '2021', Description: 'test igor insercao ' });
    // if (1 == 1);
    // person.addProl(proposal);
    // if (1 == 1);
    var person = await Person.findOne({
        where: { Id: '8275cfd0-8f40-11eb-89aa-63c8d81c7323' }, include: 'ProposalsFK'
    });
    if (1 == 1);

}
// Person.findOne({
//     where: { Id: '8275cfd0-8f40-11eb-89aa-63c8d81c7322' }
// }).then
//     .then((res) => {

//        res.addProposal()

//     });

// Proposal.findOne({
//     where: { Id: '8275cfd0-8f40-11eb-89aa-63c8d81c7322' }, include: 'PeopleFK'
// })
//     // Person.findAll({
//     //     include: {
//     //         model: Proposal,
//     //         as: 'ProposalsFK'
//     //     },
//     //     where: {
//     //         Name: 'Teste'
//     //     }
//     // })
//     .then((res) => {
//         if (1 == 1);

//     });
// Person.create({ Name: 'Teste', FullName: 'Teste1' });
// Deputado.create({ PersonId: '8275cfd0-8f40-11eb-89aa-63c8d81c7323', Name: 'Teste', FullName: 'Teste1' });
if (1 == 1);