const axios = require('axios');
// const db = require('../models/db');
const {
    v1: uuidv1,
    v4: uuidv4,
} = require('uuid');
const person = require('../models/Person');
const deputado = require('../models/Deputado');
const senador = require('../models/Senador');
const cost = require('../models/Cost');

module.exports = {
    async getDeputado(sUrl) {
        if (sUrl != null) {
            const response = await axios.get(sUrl);
            return response.data;
        }
    },
    async getDeputados() {
        const response = await axios.get('https://dadosabertos.camara.leg.br/api/v2/deputados');
        return response;
    },
    async getSenador(oData) {
        if (oData.IdentificacaoParlamentar.CodigoParlamentar != null) {
            var url = `https://legis.senado.leg.br/dadosabertos/senador/${oData.IdentificacaoParlamentar.CodigoParlamentar}`;
            const response = await axios.get(url);
            return response.data.DetalheParlamentar;
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
    async checkThereAreCostById(sId) {
        if (1 == 1);
        const Cost = await cost.findOne({ where: { IdPerson: sId } })
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
                if (index > 70) { // retira isso, feito so para teste 
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
    async fillCurrentProposals(aProposals, aAuthors, aPeople) {
        const oAuthors = this.manageAuthors(aAuthors, aPeople);
        await this.createPersonByAuthors(oAuthors.people);
        aPeople = await this.getPeopleFromDb();
        if (1 === 1);

    },
    manageAuthors(aAuthors, aPeople) {
        var oAuthorsToCreate = {};
        oAuthorsToCreate.people = [];
        // Elimina os autores duplicados
        var aUniqueAuthors = aAuthors.reduce((unique, o) => {
            if (!unique.some(obj => obj.codTipo === o.codTipo && obj.nome === o.nome)) {
                unique.push(o);
            }
            return unique;
        }, []);

        for (const author of aUniqueAuthors) {
            var sNome = "";
            if (author.codTipo == '40000') {
                author.nome = author.nome.replace("Senado Federal", "");
                sNome = author.nome.replace("-", "").trim();
            }
            else if (author.codTipo == '20000' || author.codTipo == '10000') {
                sNome = author.nome;
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
        }
        return oAuthorsToCreate;
    },
    async updateActualListParlamentares(aParlamentares, sSource) {
        if (sSource == '10000') {
            const deputados = await this.getDeputadosFromDb();
            for (const deputado of deputados) {
                const parlamentar = aParlamentares.find(x => x.id === deputado.ExternalId);
                if (parlamentar = null) {
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
                    oPerson.Id = uuidv1();
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
                oPerson.Id = uuidv1();
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
            const result = await person.bulkCreate(People, { returning: true });
            if (1 == 1);
        }
    }


}