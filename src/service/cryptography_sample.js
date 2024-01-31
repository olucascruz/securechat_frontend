import crypto from 'crypto';
import EC from 'elliptic';

// ----------------------------------------------------------------------------------------------------
// Criação de uma instância de elliptic
// ----------------------------------------------------------------------------------------------------
const ec_1 = new EC.ec('secp256k1');
const ec_2 = new EC.ec('secp256k1');
const ec_3 = new EC.ec('secp256k1');

// ----------------------------------------------------------------------------------------------------
// Pessoa A - Geração de chave privada e extração da chave pública
// ----------------------------------------------------------------------------------------------------
const CPRA = ec_1.genKeyPair();

// ----------------------------------------------------------------------------------------------------
// Pessoa B - Geração de chave privada e extração da chave pública
// ----------------------------------------------------------------------------------------------------
const chavePrivadaB = ec_2.genKeyPair();
const chavePublicaB = chavePrivadaB.getPublic('hex');

// ----------------------------------------------------------------------------------------------------
// Pessoa A envia sua chave pública para Pessoa B
// ----------------------------------------------------------------------------------------------------
//console.log('Pessoa A enviou sua chave pública para Pessoa B:', chavePublicaA);

const chavePrivadaString = CPRA.getPrivate('hex');
const chavePublicaString = CPRA.getPublic('hex');

console.log("---------------------------------CHAVE CONVERTIDA EM HEXADECIMAL----------------------------------------------------")
console.log(chavePrivadaString)
console.log(chavePublicaString)

const chavePrivadaA = ec_1.keyFromPrivate(chavePrivadaString, 'hex');
const chavePublicaA = ec_1.keyFromPublic(chavePublicaString, 'hex');

console.log("--------------------------------CHAVE CONVERTIDA DE VOLTA EM OBJETO-----------------------------------------------------")

console.log(chavePrivadaA)
console.log(chavePublicaA)

console.log("-------------------------------------------------------------------------------------")

// ----------------------------------------------------------------------------------------------------
// Pessoa B envia sua chave pública para Pessoa A
// ----------------------------------------------------------------------------------------------------
console.log('Pessoa B enviou sua chave pública para Pessoa A:', chavePublicaB);

// ----------------------------------------------------------------------------------------------------
//                    SIMULAÇÂO PESSOA A QUER ENVIAR MENSAGEM PARA PESSOA B
// ----------------------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------------------
//                    PASSO 1 - RECEBE A CHAVE PUBLICA DA PESSOA B NO SERVIDOR
// ----------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------
//       PASSO 2 - GERA A CHAVE COMPARTILHADA USANDO A CHAVE PRIVADA DE A E A CHAVE PUBLICA DE B
// ----------------------------------------------------------------------------------------------------

const chaveCompartilhadaA = chavePrivadaA.derive(ec_1.keyFromPublic(chavePublicaB, 'hex').getPublic()).toArray();

// -------------------------------------------------------------------------------------------------------------------------------------------------------
//      PASSO 3 - GERA UM VETOR DE INICIALIZAÇÃO ALEATÓRIO E CRIPTOGRAFA A MENSAGEM USANDO O IV E A CHAVE SIMETRICA GERADA PELA CHAVE COMPARTILHADA DE A
// --------------------------------------------------------------------------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------------------
//                    PASSO 4 - ENVIA A MENSAGEM CIFRADA PARA O SERVIDOR
// ----------------------------------------------------------------------------------------------------

const mensagemOriginalA = 'Oi Pessoa B, sou a Pessoa A! MOTO MOTO OIEEEEE';
const ivA = crypto.randomBytes(16); // IV único para cada mensagem
const cipherA = crypto.createCipheriv('aes-256-ctr', Buffer.from(chaveCompartilhadaA), ivA);
const mensagemCriptografadaA = Buffer.concat([ivA, cipherA.update(mensagemOriginalA, 'utf-8'), cipherA.final()]);
console.log('Pessoa A cifrou a mensagem:', mensagemCriptografadaA.toString('hex'));

// ----------------------------------------------------------------------------------------------------
//                  SIMULAÇÂO PESSOA B RECEBE A MENSAGEM CIFRADA E DECRIPTOGRAFA ELA
// ----------------------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------------------
//         PASSO 1 - RECEBE A CHAVE PUBLICA A E A MENSAGEM CRIPTOGRAFADA DA PESSOA A NO SERVIDOR
// ----------------------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------------------
//      PASSO 2 -  GERA A CHAVE COMPARTILHADA B USANDO A CHAVE PRIVADA DE B E A CHAVE PUBLICA DE A
// ----------------------------------------------------------------------------------------------------

const chaveCompartilhadaB = chavePrivadaB.derive(ec_2.keyFromPublic(chavePublicaA, 'hex').getPublic()).toArray();

// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//    PASSO 3 - GERA UM VETOR DE INICIALIZAÇÃO APARTIR DA MENSAGEM CRIPTOGRAFADA E UMA CHAVE SIMETRICA APARTIR DA CHAVECOMPARTILHADA DE B E DECRIPTA A MENSAGEM USANDO O IVB E A A CHAVE SIMETRICA DECIPHER B
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const ivB = mensagemCriptografadaA.slice(0, 16);
const ciphertextB = mensagemCriptografadaA.slice(16);
const decipherB = crypto.createDecipheriv('aes-256-ctr', Buffer.from(chaveCompartilhadaB), ivB);
const mensagemDecifradaB = decipherB.update(ciphertextB, 'hex', 'utf-8') + decipherB.final('utf-8');
console.log('\nPessoa B decifrou a mensagem de Pessoa A:', mensagemDecifradaB);

// ... Repetir o processo para a resposta de Pessoa B ...

//----------------------------------------------------------------------------------------------------

const chavePrivadaC = ec_3.genKeyPair();
const chavePublicaC = chavePrivadaC.getPublic('hex');

const chaveCompartilhadaC = chavePrivadaC.derive(ec_3.keyFromPublic(chavePublicaA, 'hex').getPublic()).toArray();

const ivC = mensagemCriptografadaA.slice(0, 16);
const ciphertextC = mensagemCriptografadaA.slice(16);
const decipherC = crypto.createDecipheriv('aes-256-ctr', Buffer.from(chaveCompartilhadaC), ivC);
const mensagemDecifradaC = decipherC.update(ciphertextC, 'hex', 'utf-8') + decipherC.final('utf-8');
console.log('\nPessoa C tentou decifrou a mensagem que a Pessoa A mandou pra Pessoa B:', mensagemDecifradaC);