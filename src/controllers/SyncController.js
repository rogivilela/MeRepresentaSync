const axios = require('axios');
// const db = require('../models/db');
const moment = require('moment');
const { Op } = require("sequelize");
const {
    v1: uuidv1,
    v4: uuidv4,
} = require('uuid');
const person = require('../models/Person');
const deputado = require('../models/Deputado');
const senador = require('../models/Senador');
const cost = require('../models/Cost');
const proposal = require('../models/Proposal');
const author = require('../models/AuthorPerson');
const entity = require('../models/Entity');
const Deliberation = require('../models/Deliberation');
const Vote = require('../models/Vote');

module.exports = {
    async getDeputado(sUrl) {
        if (sUrl != null) {
            var response = {};
            for (var i = 0; i < 0; i++) {
                response = await axios.get(sUrl);
                if (response != null) return response.data;
            }


            return response;
        }
    },
    async getDataFromCamaraApiByLink(sUrl) {
        if (sUrl != null) {
            var response = {};
            for (var i = 0; i < 10; i++) {
                response = await axios.get(sUrl);
                if (response != null) return response.data;
            }


            return response;
        }
    },
    async getDeputados() {
        const response = await axios.get('https://dadosabertos.camara.leg.br/api/v2/deputados');
        return response;
    },
    async getSenador(oData) {
        if (oData.IdentificacaoParlamentar.CodigoParlamentar != null) {
            var url = `https://legis.senado.leg.br/dadosabertos/senador/${oData.IdentificacaoParlamentar.CodigoParlamentar}`;
            // const response = await axios.get(url);
            // return response.data.DetalheParlamentar;
            var response = {};
            for (var i = 0; i < 10; i++) {
                response = await axios.get(url);
                if (response != null) return response.data.DetalheParlamentar;
            }
            return response;
        }
    },
    async getSenadores() {
        const response = await axios.get('https://legis.senado.leg.br/dadosabertos/senador/lista/atual');
        return response;
    },
    fillOPerson(oPerson, sSource) {
        if (sSource === '10000') {
            const oPersonOut = {
                Name: oPerson.ultimoStatus.nome,
                FullName: oPerson.nomeCivil,
                Birthdate: oPerson.dataNascimento,
                Email: oPerson.ultimoStatus.email,
                IdDocument: oPerson.cpf,
                UrlPicture: oPerson.ultimoStatus.urlFoto,
                Source: sSource, // Fonte da Camara dos deputados
                Deputado: {
                    PersonId: null,
                    Name: oPerson.ultimoStatus.nome,
                    FullName: oPerson.nomeCivil,
                    Party: oPerson.ultimoStatus.siglaPartido,
                    State: oPerson.ultimoStatus.siglaUf,
                    UrlPicture: oPerson.ultimoStatus.urlFoto,
                    Email: oPerson.ultimoStatus.email,
                    ExternalId: oPerson.id
                }
            }
            return oPersonOut;
        }
        else if (sSource === '20000') {
            const oPersonOut = {
                Name: oPerson.IdentificacaoParlamentar.NomeParlamentar,
                FullName: oPerson.IdentificacaoParlamentar.NomeCompletoParlamentar,
                Birthdate: oPerson.DadosBasicosParlamentar.DataNascimento,
                Email: oPerson.IdentificacaoParlamentar.EmailParlamentar,
                IdDocument: null,
                UrlPicture: oPerson.IdentificacaoParlamentar.UrlFotoParlamentar,
                Source: sSource, // Fonte dos dados
                Senador: {
                    PersonId: null,
                    Name: oPerson.IdentificacaoParlamentar.NomeParlamentar,
                    FullName: oPerson.IdentificacaoParlamentar.NomeCompletoParlamentar,
                    Party: oPerson.IdentificacaoParlamentar.SiglaPartidoParlamentar,
                    State: oPerson.IdentificacaoParlamentar.UfParlamentar,
                    UrlPicture: oPerson.IdentificacaoParlamentar.UrlFotoParlamentar,
                    Email: oPerson.IdentificacaoParlamentar.EmailParlamentar,
                    ExternalId: oPerson.IdentificacaoParlamentar.CodigoParlamentar,
                }
            }
            return oPersonOut;
        }

    },
    async checkPersonV2(aPeople, sSource) {
        const aSenadores = [];
        const aDeputados = [];
        if (sSource === '10000') {
            const result = await person.bulkCreate(aPeople, {
                fields: ['Name', 'FullName', 'Birthdate', 'Email', 'IdDocument', 'UrlPicture', 'Source', 'createdAt', 'updatedAt'],
                updateOnDuplicate: ['Name', 'FullName', 'Birthdate', 'Email', 'IdDocument', 'UrlPicture', 'Source', 'updatedAt'],
            });
            const aPeopleFinded = await person.findAll();
            for (const person of aPeople) {
                const PersonResult = aPeopleFinded.find(x => x.FullName === person.FullName && x.Birthdate === person.Birthdate);
                if (PersonResult != null) {
                    person.Deputado.PersonId = PersonResult.Id;
                    aDeputados.push(person.Deputado);
                }
            }
            if (aDeputados.length > 0) {
                const result = await deputado.bulkCreate(aDeputados, {
                    fields: ['PersonId', 'Name', 'FullName', 'Party', 'State', 'UrlPicture', 'Email', 'ExternalId', 'createdAt', 'updatedAt'],
                    updateOnDuplicate: ['Name', 'FullName', 'Party', 'State', 'UrlPicture', 'Email', 'ExternalId', 'updatedAt'],
                });

            }
        }
        else if (sSource === '20000') {
            const result = await person.bulkCreate(aPeople, {
                fields: ['Name', 'FullName', 'Birthdate', 'Email', 'IdDocument', 'UrlPicture', 'Source', 'createdAt', 'updatedAt'],
                updateOnDuplicate: ['Name', 'FullName', 'Birthdate', 'Email', 'IdDocument', 'UrlPicture', 'Source', 'updatedAt'],
            });
            const aPeopleFinded = await person.findAll();
            for (const person of aPeople) {
                const PersonResult = aPeopleFinded.find(x => x.FullName === person.FullName && x.Birthdate === person.Birthdate);
                if (PersonResult != null) {
                    person.Senador.PersonId = PersonResult.Id;
                    aSenadores.push(person.Senador);
                }
            }
            if (aSenadores.length > 0) {
                const result = await senador.bulkCreate(aSenadores, {
                    fields: ['PersonId', 'Name', 'FullName', 'Party', 'State', 'UrlPicture', 'Email', 'ExternalId', 'createdAt', 'updatedAt'],
                    updateOnDuplicate: ['Name', 'FullName', 'Party', 'State', 'UrlPicture', 'Email', 'ExternalId', 'updatedAt'],
                });

            }
        }
    },
    checkPerson(oPerson, sSource) {
        if (sSource === '10000') {
            person.findOrCreate({
                where: { FullName: oPerson.nomeCivil, Birthdate: oPerson.dataNascimento },
                defaults: {
                    Name: oPerson.ultimoStatus.nome,
                    FullName: oPerson.nomeCivil,
                    Birthdate: oPerson.dataNascimento,
                    Email: oPerson.ultimoStatus.email,
                    IdDocument: oPerson.cpf,
                    UrlPicture: oPerson.ultimoStatus.urlFoto,
                    Source: sSource // Fonte da Camara dos deputados
                }
            })
                .then(function (res) {
                    if (res[1] === true) {
                        deputado.create({
                            PersonId: res[0].Id,
                            Name: oPerson.ultimoStatus.nome,
                            FullName: oPerson.nomeCivil,
                            Party: oPerson.ultimoStatus.siglaPartido,
                            State: oPerson.ultimoStatus.siglaUf,
                            UrlPicture: oPerson.ultimoStatus.urlFoto,
                            Email: oPerson.ultimoStatus.email,
                            ExternalId: oPerson.id
                        })
                    }
                    else if (res[1] === false) {
                        person.update(
                            {
                                Name: oPerson.ultimoStatus.nome,
                                FullName: oPerson.nomeCivil,
                                Birthdate: oPerson.dataNascimento,
                                Email: oPerson.ultimoStatus.email,
                                IdDocument: oPerson.cpf,
                                UrlPicture: oPerson.ultimoStatus.urlFoto
                            },
                            { where: { PersonId: res[0].Id } }
                        )
                        deputado.update(
                            {
                                Name: oPerson.ultimoStatus.nome,
                                FullName: oPerson.nomeCivil,
                                Party: oPerson.ultimoStatus.siglaPartido,
                                State: oPerson.ultimoStatus.siglaUf,
                                UrlPicture: oPerson.ultimoStatus.urlFoto,
                                Email: oPerson.ultimoStatus.email,
                                ExternalId: oPerson.id
                            },
                            { where: { PersonId: res[0].Id } }
                        )
                    }

                })
                .catch(function (error) {
                    console.log(erro);
                });
        }

        else if (sSource === '20000') {
            person.findOrCreate({
                where: {
                    FullName: oPerson.IdentificacaoParlamentar.NomeCompletoParlamentar,
                    Birthdate: oPerson.DadosBasicosParlamentar.DataNascimento
                },
                defaults: {
                    Name: oPerson.IdentificacaoParlamentar.NomeParlamentar,
                    FullName: oPerson.IdentificacaoParlamentar.NomeCompletoParlamentar,
                    Birthdate: oPerson.DadosBasicosParlamentar.DataNascimento,
                    Email: oPerson.IdentificacaoParlamentar.EmailParlamentar,
                    IdDocument: null,
                    UrlPicture: oPerson.IdentificacaoParlamentar.UrlFotoParlamentar,
                    Source: sSource // Fonte da Camara dos deputados
                }
            })
                .then(function (res) {
                    if (res[1] === true) {
                        senador.create({
                            PersonId: res[0].Id,
                            Name: oPerson.IdentificacaoParlamentar.NomeParlamentar,
                            FullName: oPerson.IdentificacaoParlamentar.NomeCompletoParlamentar,
                            Party: oPerson.IdentificacaoParlamentar.SiglaPartidoParlamentar,
                            State: oPerson.IdentificacaoParlamentar.UfParlamentar,
                            UrlPicture: oPerson.IdentificacaoParlamentar.UrlFotoParlamentar,
                            Email: oPerson.IdentificacaoParlamentar.EmailParlamentar,
                            ExternalId: oPerson.IdentificacaoParlamentar.CodigoParlamentar
                        })
                    }
                    else if (res[1] === false) {
                        person.update(
                            {
                                Name: oPerson.IdentificacaoParlamentar.NomeParlamentar,
                                FullName: oPerson.IdentificacaoParlamentar.NomeCompletoParlamentar,
                                Birthdate: oPerson.DadosBasicosParlamentar.DataNascimento,
                                Email: oPerson.IdentificacaoParlamentar.EmailParlamentar,
                                IdDocument: null,
                                UrlPicture: oPerson.IdentificacaoParlamentar.UrlFotoParlamentar
                            },
                            { where: { PersonId: res[0].Id } }
                        )
                        senador.update(
                            {
                                Name: oPerson.IdentificacaoParlamentar.NomeParlamentar,
                                FullName: oPerson.IdentificacaoParlamentar.NomeCompletoParlamentar,
                                Party: oPerson.IdentificacaoParlamentar.SiglaPartidoParlamentar,
                                State: oPerson.IdentificacaoParlamentar.UfParlamentar,
                                UrlPicture: oPerson.IdentificacaoParlamentar.UrlFotoParlamentar,
                                Email: oPerson.IdentificacaoParlamentar.EmailParlamentar,
                                ExternalId: oPerson.IdentificacaoParlamentar.CodigoParlamentar
                            },
                            { where: { PersonId: res[0].Id } }
                        )
                    }

                })
                .catch(function (error) {
                    console.log(erro);
                });
        }
    },
    async getDeputadosFromDb() {
        const deputados = await deputado.findAll();
        return deputados;
    },
    async getSenadoresFromDb() {
        const senadores = await senador.findAll();
        return senadores;
    },
    async getPeopleFromDb() {
        const people = await person.findAll();
        return people;
    },
    async getEntitiesFromDb() {
        const entities = await entity.findAll();
        return entities;
    },
    async getProposalsFromDb(oWhere) {
        const proposals = await proposal.findAll(oWhere);
        return proposals;
    },
    async checkThereAreCostById(sId) {
        if (1 == 1);
        const Cost = await cost.findOne({ where: { PersonId: sId } })
        if (Cost != null) {
            return true;
        }
        else {
            return false;
        }
    },
    async getCostsByExternalIdFromApi(sExternalId, oDate) {
        if (1 == 1);
        if (oDate.month == null) {
            var url = `https://dadosabertos.camara.leg.br/api/v2/deputados/${sExternalId}/despesas?ano=${oDate.year}&ordem=DESC&ordenarPor=ano`;
        }
        else {
            var url = `https://dadosabertos.camara.leg.br/api/v2/deputados/${sExternalId}/despesas?ano=${oDate.year}&mes=${oDate.month}&ordem=DESC&ordenarPor=ano`;
        }

        const response = await axios.get(url);
        const { links } = response.data;
        var oLink = links.find(link => link.rel === "next");

        if (oLink != null) {

            while (oLink != null) {
                const linkNext = await this.getByLinkFromApi(oLink);
                const { dados } = linkNext;
                const { links } = linkNext;
                oLink = links.find(link => link.rel === "next");
                for (const linha of dados) {
                    response.data.dados.push(linha);
                }
            }
        }

        return response.data;
    },
    async getByLinkFromApi(oLink) {
        try {
            const response = await axios.get(oLink.href);
            return response.data;
        }
        catch (e) {
            console.log(e);
        }

    },
    fillCostsByIdV2(sId, oCosts, sSource) {
        const costs = [];
        if (sSource === "10000") {
            const { dados } = oCosts;
            for (const linha of dados) {
                const cost = {
                    PersonId: sId,
                    TypePerson: sSource, // Fonte da Camara dos deputados
                    Month: linha.mes,
                    Year: linha.ano,
                    Value: linha.valorLiquido,
                    UrlPicture: linha.urlDocumento,
                    Invoice: linha.codDocumento + "@" + linha.numDocumento,
                    Supplier: linha.cnpjCpfFornecedor
                }

                costs.push(cost);
            }
        }
        else if (sSource === "20000") {
            for (const linha of oCosts) {
                linha.CNPJ_CPF = linha.CNPJ_CPF.replace(/[.]+/g, '')
                linha.CNPJ_CPF = linha.CNPJ_CPF.replace(/[-]+/g, '')
                linha.CNPJ_CPF = linha.CNPJ_CPF.replace(/[/]+/g, '')
                const cost = {
                    PersonId: sId,
                    TypePerson: sSource, // Fonte do Senado
                    Month: linha.MES,
                    Year: linha.ANO,
                    Value: linha.VALOR_REEMBOLSADO.replace(/[.]+/g, '').replace(/[,]+/g, '.'),
                    Invoice: linha.DOCUMENTO + "@" + linha.COD_DOCUMENTO,
                    Supplier: linha.CNPJ_CPF
                }
                costs.push(cost);
            }
        }
        return costs;
    },
    async saveCostsFromObject(aCosts) {
        for (const costsByParlamentar of aCosts) {
            const result = await cost.bulkCreate(costsByParlamentar, {
                fields: ['PersonId', 'TypePerson', 'Month', 'Year', 'Value', 'UrlPicture', 'Invoice', 'Supplier', 'CreatedAt', 'updatedAt'],
                updateOnDuplicate: ['Value', 'UrlPicture', 'updatedAt'],
            });
            if (1 == 1);
        }
    },
    async fillCostsById(sId, oCosts, sSource) {
        var result = {};

        if (sSource === "10000") {
            const { dados } = oCosts;
            for (const linha of dados) {
                result = await cost.findOrCreate({
                    where: {
                        IdPerson: sId,
                        Invoice: linha.codDocumento + "@" + linha.numDocumento,
                        Supplier: linha.cnpjCpfFornecedor,
                        TypePerson: sSource
                    },
                    defaults: {
                        Id: uuidv1(),
                        IdPerson: sId,
                        TypePerson: sSource, // Fonte da Camara dos deputados
                        Month: linha.mes,
                        Year: linha.ano,
                        Value: linha.valorLiquido,
                        UrlPicture: linha.urlDocumento,
                        Invoice: linha.codDocumento + "@" + linha.numDocumento,
                        Supplier: linha.cnpjCpfFornecedor
                    }
                })
                if (result[1] === false) {
                    result = await cost.update(
                        {
                            Value: linha.valorLiquido,
                            UrlPicture: linha.urlDocumento,
                        },
                        { where: { Id: result[0].Id } }
                    )
                }

            }
        }
        else if (sSource === "20000") {
            for (const linha of oCosts) {
                linha.CNPJ_CPF = linha.CNPJ_CPF.replace(/[.]+/g, '')
                linha.CNPJ_CPF = linha.CNPJ_CPF.replace(/[-]+/g, '')
                linha.CNPJ_CPF = linha.CNPJ_CPF.replace(/[/]+/g, '')
                result = await cost.findOrCreate({
                    where: {
                        IdPerson: sId,
                        Month: linha.MES,
                        Year: linha.ANO,
                        Invoice: linha.DOCUMENTO + "@" + linha.COD_DOCUMENTO,
                        Supplier: linha.CNPJ_CPF,
                        TypePerson: sSource
                    },
                    defaults: {
                        Id: uuidv1(),
                        IdPerson: sId,
                        TypePerson: sSource, // Fonte do Senado
                        Month: linha.MES,
                        Year: linha.ANO,
                        Value: linha.VALOR_REEMBOLSADO.replace(/[.]+/g, '').replace(/[,]+/g, '.'),
                        Invoice: linha.DOCUMENTO + "@" + linha.COD_DOCUMENTO,
                        Supplier: linha.CNPJ_CPF

                    }
                });
                if (result[1] === false) {
                    result = await cost.update(
                        {
                            Value: linha.VALOR_REEMBOLSADO.replace(/[.]+/g, '').replace(/[,]+/g, '.')
                        },
                        { where: { Id: result[0].Id } }
                    )
                }
            }
        }
    },
    async getCSVFileFromSenadoByYear(sYear) {
        const url = `https://www.senado.gov.br/transparencia/LAI/verba/despesa_ceaps_${sYear}.csv`;
        const response = await axios({ method: 'GET', url: url, responseType: 'arraybuffer' });
        return this.convertResponseToJSON(response);



    },
    convertResponseToJSON(oResponse) {
        const sData = oResponse.data.toString('latin1');
        const aData = sData.split("\r");
        var f = sData.replace(/[\r]*/g, "").split("\n");
        var headers = f[1].replace(/['"]+/g, '').split(";");

        var json = [];
        for (var l = 2; l < f.length; l++) {
            if (l == 1999) {
                if (1 == 1);
            }
            var tmp = {};
            try {
                var row = f[l].split('";"');
                for (var i = 0; i < headers.length; i++) {

                    tmp[headers[i]] = row[i].replace(/['"]+/g, '');
                }
                try {

                    json.push(tmp);

                }
                catch (e) {
                    console.log(e);
                }
            }
            catch (e) {
                // console.log(e);
            }
        }

        return json;
    },
    async getCurrentProposals() {
        var proposals = [];
        const response = await axios.get('https://dadosabertos.camara.leg.br/api/v2/proposicoes?siglaTipo=PEC&siglaTipo=PLP&siglaTipo=PL&siglaTipo=MPV&ordem=desc&ordenarPor=id');

        var index = 0;
        const { links } = response.data;
        var oLink = links.find(link => link.rel === "next");
        if (oLink != null) {

            while (oLink != null) {
                index++

                const linkNext = await this.getByLinkFromApi(oLink);

                const { dados } = linkNext;
                const { links } = linkNext;
                oLink = links.find(link => link.rel === "next");
                if (index > 15) { // retira isso, feito so para teste 
                    oLink = null;
                }
                for (const linha of dados) {
                    response.data.dados.push(linha);
                }
            }
        }

        const { dados } = response.data;
        for (const linha of dados) {
            proposals.push(linha);
        }
        return proposals;
    },
    async getDetailedProposalByLink(sLink) {
        try {
            const response = await axios.get(sLink);
            const { dados } = response.data;
            if (dados.uriAutores != null) {
                const authors = await this.getAuthorsById(dados.id);
                dados.authors = [];
                dados.authors = authors;
                // const filtro = authors.filter(x => x.codTipo == '20000');
                // if (filtro.length > 0) {
                //     if (1 == 1);
                // }
            }
            return dados;
        } catch (error) {
            console.log(error);
        }
    },
    async getAuthorsById(sId) {
        var authors = [];
        const url = `https://dadosabertos.camara.leg.br/api/v2/proposicoes/${sId}/autores`;
        try {
            const response = await axios.get(url);

            const { links } = response.data;
            var oLink = links.find(link => link.rel === "next");
            if (oLink != null) {

                while (oLink != null) {
                    const linkNext = await this.getByLinkFromApi(oLink);
                    const { dados } = linkNext;
                    const { links } = linkNext;
                    oLink = links.find(link => link.rel === "next");
                    for (const linha of dados) {
                        response.data.dados.push(linha);
                    }
                }
            }

            const { dados } = response.data;
            for (const linha of dados) {
                authors.push(linha);
            }

            return authors;
        } catch (error) {
            console.log(error);
        }
    },
    async fillCurrentProposals(aProposals, aAuthors, sSource) {
        const aProposalsToinsert = [];
        var aPeople = await this.getPeopleFromDb();
        var aEntities = await this.getEntitiesFromDb();
        var oAuthors = await this.manageAuthors(aAuthors, aPeople, aEntities);
        await this.createPersonByAuthors(oAuthors.people);
        await this.createEntitiesByAuthors(oAuthors.entities);
        aPeople = await this.getPeopleFromDb();
        aEntities = await this.getEntitiesFromDb();
        aProposals = this.updateModelProposalsWithPeople(aPeople, aEntities, aProposals);
        for (const Proposal of aProposals) {
            oAuthors = [];

            const ProprosalToInsert = {
                Type: Proposal.siglaTipo,
                Number: Proposal.numero,
                Year: Proposal.ano,
                Description: Proposal.ementa,
                ExternalIdCamara: sSource === '10000' ? Proposal.id : null,
                ExternalIdSenado: sSource === '20000' ? Proposal.id : null,
                DescriptionDetailed: Proposal.ementaDetalhada,
                Justification: Proposal.justificativa,
                Text: Proposal.texto,
                UrlDocument: Proposal.urlInteiroTeor,
                CurrentProposal: true,
                Keywords: Proposal.keywords,
                LastUpdate: Proposal.statusProposicao.dataHora,
            }
            aProposalsToinsert.push(ProprosalToInsert);
            // const [resultProposal, bIsCreated] = await proposal.upsert(ProprosalToInsert);
            // for (const author of Proposal.authors) {
            //     const resultAuthor = await resultProposal.addPeopleFK(author);
            // }

        }

        const result = await proposal.bulkCreate(aProposalsToinsert, {
            fields: ['Type', 'Number', 'Year', 'Description', 'ExternalIdCamara', 'ExternalIdSenado', 'DescriptionDetailed', 'Justification', 'Text', 'UrlDocument', 'CurrentProposal', 'Keywords', 'LastUpdate', 'createdAt', 'updatedAt'],
            updateOnDuplicate: ['Type', 'Number', 'Year', 'Description', 'ExternalIdCamara', 'ExternalIdSenado', 'DescriptionDetailed', 'Justification', 'Text', 'UrlDocument', 'CurrentProposal', 'Keywords', 'LastUpdate', 'updatedAt'],
        });

        const aProposalsFromDb = await this.getProposalsFromDb({ where: { CurrentProposal: true } });
        for (const proposalFromDb of aProposalsFromDb) {
            const Proposal = aProposals.find(x => x.siglaTipo === proposalFromDb.Type &&
                x.numero === proposalFromDb.Number &&
                x.ano === proposalFromDb.Year);

            if (Proposal != null) {

                if (1 === 1);
                for (const author of Proposal.authors) {
                    const personFromdb = await person.findByPk(author.Id);
                    if (personFromdb != null) {
                        const resultAuthor = await proposalFromDb.addPeopleFK(personFromdb, {
                            fields: ['OrderSignature', 'CreatedAt', 'updatedAt', 'PersonId', 'ProposalId'],
                            update: true,
                            through: {
                                OrderSignature: author.OrderSignature,
                            }
                        });
                    }
                    else {
                        const entityFromdb = await entity.findByPk(author.Id);
                        if (entityFromdb != null) {
                            const resultAuthor = await proposalFromDb.addEntitiesFK(entityFromdb, {
                                fields: ['OrderSignature', 'CreatedAt', 'updatedAt', 'EntityId', 'ProposalId'],
                                update: true,
                                through: {
                                    OrderSignature: author.OrderSignature,
                                }
                            });
                        }
                    }
                }
            }
            else {
                // Retira as propostas de atual 
                const response = await proposalFromDb.update({
                    CurrentProposal: false
                })
            }
        }


        if (1 === 1);

    },
    updateModelProposalsWithPeople(aPeople, aEntities, aProposals) {
        var aAuthors = [];
        var aProposalsAux = [];
        var find = {};
        for (const proposal of aProposals) {
            aAuthors = [];
            for (const author of proposal.authors) {
                var sNome = "";
                if (author.codTipo == '40000') {
                    author.nome = author.nome.replace("Senado Federal", "");
                    sNome = author.nome.replace("-", "").trim();
                }
                else if (author.codTipo == '20000' || author.codTipo == '10000') {
                    sNome = author.nome;
                }
                else {
                    sNome = author.nome;
                }
                if ((author.codTipo == '10000' || author.codTipo == '20000' || author.codTipo == '40000') && sNome != "") {
                    if (proposal.authors.length > 100) {
                        if (1 == 1);
                    }
                    find = {};
                    find = aPeople.find(x => x.Name === sNome ||
                        x.Name === sNome.toUpperCase() ||
                        x.Name === sNome.toLowerCase());
                    if (find != null) {
                        var personInput = {};
                        personInput = Object.create(find);
                        personInput.OrderSignature = author.ordemAssinatura;
                        aAuthors.push(personInput);
                    }
                }
                else {
                    find = {};
                    find = aEntities.find(x => x.Name === sNome ||
                        x.Name === sNome.toUpperCase() ||
                        x.Name === sNome.toLowerCase());
                    if (find != null) {
                        var entityInput = {};
                        entityInput = Object.create(find);
                        entityInput.OrderSignature = author.ordemAssinatura;
                        aAuthors.push(entityInput);
                    }
                }
            }
            proposal.authors = [];
            proposal.authors = aAuthors;
            aProposalsAux.push(proposal);
        }
        return aProposalsAux;
    },
    async manageAuthors(aAuthors, aPeople, aEntities) {
        var oAuthorsToCreate = {};
        oAuthorsToCreate.people = [];
        oAuthorsToCreate.entities = [];

        // Elimina os autores duplicados
        var aUniqueAuthors = aAuthors.reduce((unique, o) => {
            if (o == null) {
                if (1 == 1);
            }
            else {
                if (!unique.some(obj => obj.codTipo === o.codTipo && obj.nome === o.nome)) {
                    unique.push(o);
                }
            }
            return unique;
        }, []);

        for (const author of aUniqueAuthors) {
            var sNome = "";
            if (author.codTipo == '40000') {
                author.nome = author.nome.replace("Senado Federal", "");
                sNome = author.nome.replace("-", "").trim();
                if (sNome == '') {
                    if (author.uri != null) {
                        const { dados } = await this.getDataFromCamaraApiByLink(author.uri);
                        if (dados != null) {
                            sNome = dados.nome;
                            author.codTipo = '40001'
                        }
                        else {
                            sNome = author.nome;
                        }
                    }
                }
            }
            else if (author.codTipo == '20000' || author.codTipo == '10000') {
                if (author.codTipo == '10000' && author.uri != null) {
                    const { dados } = await this.getDeputado(author.uri);
                    if (dados != null) {
                        sNome = dados.ultimoStatus.nome;
                    }
                    else {
                        sNome = author.nome;
                    }
                }
                else {
                    sNome = author.nome;
                }
            }
            else {
                if (author.uri != null) {
                    const { dados } = await this.getDataFromCamaraApiByLink(author.uri);
                    if (dados != null) {
                        sNome = dados.nome;
                    }
                    else {
                        sNome = author.nome;
                    }
                }
                else {
                    sNome = author.nome;
                }
            }
            if ((author.codTipo == '10000' || author.codTipo == '20000' || author.codTipo == '40000') && sNome != "") {
                const filtro = aPeople.filter(x => x.Name === sNome ||
                    x.Name === sNome.toUpperCase() ||
                    x.Name === sNome.toLowerCase());
                if (filtro.length === 0) {
                    author.nome = sNome;
                    oAuthorsToCreate.people.push(author);
                }
            }
            else {
                const filtro = aEntities.filter(x => x.Name === sNome ||
                    x.Name === sNome.toUpperCase() ||
                    x.Name === sNome.toLowerCase());
                if (filtro.length === 0) {
                    author.nome = sNome;
                    oAuthorsToCreate.entities.push(author);
                }
            }
        }
        return oAuthorsToCreate;
    },
    async updateActualListParlamentares(aParlamentares, sSource) {
        if (sSource == '10000') {
            const deputados = await this.getDeputadosFromDb();
            for (const deputado of deputados) {
                const parlamentar = aParlamentares.find(x => x.id === deputado.ExternalId);
                if (parlamentar == null) {
                    const deletedLines = await deputado.destroy({
                        where: {
                            Id: deputado.Id
                        }

                    });
                    if (deletedLines != null) {
                        console.log('Deleted successfully: ' + deletedLines);
                    }
                }
            }
        }
        else if (sSource == '20000') {
            const senadores = await this.getSenadoresFromDb();
            for (const senador of senadores) {
                const parlamentar = aParlamentares.find(x => x.IdentificacaoParlamentar.CodigoParlamentar == senador.ExternalId);
                if (parlamentar == null) {
                    const deletedLines = await senador.destroy({
                        where: {
                            Id: senador.Id
                        }
                    });
                    if (deletedLines != null) {
                        console.log('Deleted successfully: ' + deletedLines);
                    }
                }
            }
        }
    },
    async createPersonByAuthors(aPeople) {
        var People = [];


        for (const person of aPeople) {
            const oPerson = {
                Id: null,
                Name: null,
                FullName: null,
                Birthdate: null,
                Email: null,
                IdDocument: null,
                UrlPicture: null,
                Source: null
            };
            if (person.codTipo == '10000') {
                const { dados } = await this.getDeputado(person.uri);
                if (dados != null) {
                    oPerson.Name = dados.ultimoStatus.nome;
                    oPerson.FullName = dados.nomeCivil;
                    oPerson.Birthdate = dados.dataNascimento;
                    oPerson.Email = dados.ultimoStatus.email;
                    oPerson.IdDocument = dados.cpf;
                    oPerson.UrlPicture = dados.ultimoStatus.urlFoto;
                    oPerson.Source = '10000';

                    People.push(oPerson);
                }
            }
            else {
                oPerson.Name = person.nome;
                oPerson.FullName = person.nome;
                oPerson.Birthdate = null;
                oPerson.Email = "";
                oPerson.IdDocument = "";
                oPerson.UrlPicture = "";
                oPerson.Source = '10000';

                People.push(oPerson);
            }
        }
        if (People.length > 0) {
            const result = await person.bulkCreate(People, {
                fields: ['Name', 'FullName', 'Birthdate', 'Email', 'IdDocument', 'UrlPicture', 'Source', 'CreatedAt', 'updatedAt'],
                updateOnDuplicate: ['Name', 'FullName', 'Birthdate', 'Email', 'IdDocument', 'UrlPicture', 'Source', 'updatedAt'],
            });
            // const result = await person.bulkCreate(People, { returning: true });
            if (1 == 1);
        }
    },
    async createEntitiesByAuthors(aEntities) {
        var Entities = [];


        for (const entity of aEntities) {
            const oEntity = {
                Name: null,
                FullName: null,
                Initials: null,
                Nickname: null,
                EntityType: null,
                FundationAt: null,
                Email: null,
                Website: null,
                UrlPicture: null,
                Source: null
            };
            if (entity.uri != null) {
                const { dados } = await this.getDataFromCamaraApiByLink(entity.uri);
                if (dados != null) {
                    oEntity.Name = dados.nome;
                    oEntity.FullName = dados.nomePublicacao;
                    oEntity.Initials = dados.sigla;
                    oEntity.Nickname = dados.apelido;
                    oEntity.EntityType = dados.codTipoOrgao;
                    oEntity.FundationAt = dados.dataInicio;
                    oEntity.Email = null;
                    oEntity.Website = dados.urlWebsite;
                    oEntity.UrlPicture = null;
                    oEntity.Source = '10000';

                    Entities.push(oEntity);
                }
            }
            else {
                oEntity.Name = entity.nome;
                oEntity.FullName = entity.nome;
                oEntity.Initials = null;
                oEntity.Nickname = null;
                oEntity.EntityType = entity.codTipo;
                oEntity.FundationAt = null;
                oEntity.Email = null;
                oEntity.Website = null;
                oEntity.UrlPicture = null;
                oEntity.Source = '10000';

                Entities.push(oEntity);
            }
        }
        if (Entities.length > 0) {
            const result = await entity.bulkCreate(Entities, {
                fields: ['Name', 'FullName', 'Initials', 'Email', 'Nickname', 'EntityType', 'FudationAt', 'Email', 'Website', 'UrlPicture', 'Source', 'CreatedAt', 'updatedAt'],
                updateOnDuplicate: ['Name', 'FullName', 'Initials', 'Email', 'Nickname', 'EntityType', 'FudationAt', 'Email', 'Website', 'UrlPicture', 'Source', 'updatedAt'],
            });
            // const result = await person.bulkCreate(People, { returning: true });

        }
    },
    async getLastUpdatedProposals() {
        var toDate = new Date();
        var fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - 10);

        const aProposals = await this.getProposalsFromDb({
            where: {
                LastUpdate: {
                    [Op.between]: [fromDate, toDate]
                }
            },
        });
        return aProposals;
    },
    async getDeliberationsByProprosals(proposals) {
        var aDeliberations = [];
        for (const proposal of proposals) {
            const url = `https://dadosabertos.camara.leg.br/api/v2/proposicoes/${proposal.ExternalIdCamara}/votacoes?ordem=DESC&ordenarPor=dataHoraRegistro`;
            const response = await axios.get(url);


            const { links } = response.data;
            var oLink = links.find(link => link.rel === "next");
            if (oLink != null) {

                while (oLink != null) {
                    const linkNext = await this.getByLinkFromApi(oLink);
                    const { dados } = linkNext;
                    const { links } = linkNext;
                    oLink = links.find(link => link.rel === "next");
                    for (const linha of dados) {
                        response.data.dados.push(linha);
                    }
                }
            }

            const { dados } = response.data;
            for (const linha of dados) {
                linha.ProposalId = proposal.Id;
                aDeliberations.push(linha);
            }

        }
        return aDeliberations;
    },
    manageDeliberations(deliberations, proposals) {
        const TypeEnum = Object.freeze({
            "PL": 'Projeto de Lei',
            "PLP": 'Projeto de Lei Complementar',
            "MPV": 'Medida Provisória',
            "PEC": 'Proposta de Emenda à Constituição'
        });
        const format = num => {
            const n = String(num),
                p = n.indexOf('.')
            return n.replace(
                /\d(?=(?:\d{3})+(?:\.|$))/g,
                (m, i) => p < 0 || i < p ? `${m}.` : m
            )
        };

        var deliberationsFilter = [];
        for (const deliberation of deliberations) {
            const proposal = proposals.find(x => x.Id === deliberation.ProposalId);
            if (proposal != null) {
                if (deliberation.siglaOrgao == 'PLEN') {
                    if (!deliberation.descricao.match(/(Requerimento|requerimento|Redação Final|redação final|Redação final)/g)) {
                        if (deliberation.descricao.includes(TypeEnum[proposal.Type]) && (deliberation.descricao.includes(proposal.Number) || deliberation.descricao.includes(format(proposal.Number))) && deliberation.descricao.includes(proposal.Year)) {
                            deliberationsFilter.push(deliberation);
                        }
                    }
                }
            }
        }
        return deliberationsFilter;
    },
    async getVotesFromApiById(deliberations) {
        var aVotes = [];
        for (const deliberation of deliberations) {
            const url = `https://dadosabertos.camara.leg.br/api/v2/votacoes/${deliberation.id}/votos`;
            const response = await axios.get(url);


            const { links } = response.data;
            var oLink = links.find(link => link.rel === "next");
            if (oLink != null) {

                while (oLink != null) {
                    const linkNext = await this.getByLinkFromApi(oLink);
                    const { dados } = linkNext;
                    const { links } = linkNext;
                    oLink = links.find(link => link.rel === "next");
                    for (const linha of dados) {
                        response.data.dados.push(linha);
                    }
                }
            }

            const { dados } = response.data;
            for (const linha of dados) {
                linha.deliberationExternalId = deliberation.id;
                aVotes.push(linha);
            }

        }
        return aVotes;
    },
    async fillDeliberationsAndVotes(proposals, deliberations, votes) {
        var externalId = [];
        var aVotes = [];
        for (const deliberation of deliberations) {
            const proposal = proposals.find(x => x.dataValues.Id == deliberation.ProposalId);
            if (proposal != null) {

                const oNewDeliberation = {
                    ProposalId: deliberation.ProposalId,
                    Date: deliberation.dataHoraRegistro,
                    Description: deliberation.descricao,
                    Approved: deliberation.aprovacao,
                    ExternalId: deliberation.id,
                    Shift: 0,
                    Source: '10000',
                };
                const oDeliberationResponse = await Deliberation.upsert(oNewDeliberation, {
                    fields: ['ProposalId', 'Date', 'Description', 'Approved', 'ExternalId', 'Shift', 'Source', 'CreatedAt', 'UpdatedAt'],
                    updateOnDuplicate: ['Date', 'Description', 'Approved', 'ExternalId', 'Shift', 'Source', 'UpdatedAt']
                });

                externalId.push(deliberation.id);

            }
        }

        const response = await Deliberation.findAll({
            where: {
                ExternalId: {
                    [Op.in]: externalId
                }
            }
        })

        for (const deliberation of response) {
            aVotes = [];
            const votesFilter = votes.filter(x => x.
                deliberationExternalId == deliberation.dataValues.ExternalId);
            for (const voteFilter of votesFilter) {
                const vote = {
                    DeliberationId: deliberation.Id,
                    PersonId: voteFilter.PersonId,
                    Value: voteFilter.tipoVoto,
                }
                // const response = await deliberation.addVotesFK(vote);
                aVotes.push(vote);
            }
            if (aVotes.length > 0) {
                const result = await Vote.bulkCreate(aVotes, {
                    fields: ['DeliberationId', 'PersonId', 'Value', 'CreatedAt', 'UpdatedAt'],
                    updateOnDuplicate: ['DeliberationId', 'PersonId', 'Value', 'UpdatedAt'],
                });

            }
        }

        if (1 == 1);
    },
    async getPeopleVoted(deliberationsVotes, sSource) {
        const voteByPerson = [];
        var aDados = [];
        var oPeopleToCreate = [];
        var aPeople = await this.getPeopleFromDb();
        if (sSource == '10000') {
            // Elimina os Deputados votantes duplicados
            var aUniquePeople = deliberationsVotes.reduce((unique, o) => {
                if (o == null) {
                    if (1 == 1);
                }
                else {
                    if (!unique.some(obj => obj.deputado_.id === o.deputado_.id)) {
                        unique.push(o);
                    }
                }
                return unique;
            }, []);

            for (const deputado of aUniquePeople) {
                var sNome = "";
                const { dados } = await this.getDeputado(deputado.deputado_.uri);
                if (dados != null) {
                    sNome = dados.ultimoStatus.nome;
                    aDados.push(dados);
                }
                else {
                    sNome = deputado.deputado_.nome;
                }
                const filtro = aPeople.filter(x => x.Name === sNome ||
                    x.Name === sNome.toUpperCase() ||
                    x.Name === sNome.toLowerCase());
                if (filtro.length === 0) {
                    deputado.deputado_.nome = sNome;
                    deputado.deputado_.codTipo = '10000';
                    oPeopleToCreate.push(deputado.deputado_);
                }
            }
        }
        await this.createPersonByAuthors(oPeopleToCreate);
        aPeople = await this.getPeopleFromDb();
        for (const vote of deliberationsVotes) {
            var sNome = "";
            const dados = aDados.find(x => x.uri == vote.deputado_.uri);
            if (dados != null) {
                sNome = dados.ultimoStatus.nome;
            }
            else {
                sNome = vote.deputado_.nome;
            }
            const person = aPeople.find(x => x.Name === sNome ||
                x.Name === sNome.toUpperCase() ||
                x.Name === sNome.toLowerCase());
            if (person != null) {
                vote.PersonId = person.Id;
                voteByPerson.push(vote);
            }
        }
        return voteByPerson;
    }


}