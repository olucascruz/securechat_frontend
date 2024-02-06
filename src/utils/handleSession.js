import EC from 'elliptic';

const receiverIdString = "receiverId"
const receiverUsernameString = "receiverUsername"
const receiverPublicKeyString = "receiverPublicKey"
const receiverIsOnlineString = "receiverIsOnline"

const userPrivateKeyString = "userPrivateKey"
const userPublicKeyString = "userPublicKey"
const usernameString = "username"
const userIdString = "userId"
const userTokenString = "userToken"

const groupUsersIdString = "objectUsersId"
const groupNameString = "groupName"
const groupIdString = "groupId"

export const recoverReceiverData = () =>{
    const receiverId = sessionStorage.getItem(receiverIdString);
    const receiverUsername = sessionStorage.getItem(receiverUsernameString);
    const receiverPublicKey = sessionStorage.getItem(receiverPublicKeyString);
    const receiverIsOnline = sessionStorage.getItem(receiverIsOnlineString);

    const receiverData = {
        id: receiverId || '', // Definir um valor padrão vazio se o item não estiver presente
        username: receiverUsername || '',
        publicKey: receiverPublicKey || '',
        isOnline: receiverIsOnline || false, 
        
    };

    return receiverData 
}


export const recoverKeys = () =>{
    
    const userPrivateKey = sessionStorage.getItem(userPrivateKeyString)

    if(!userPrivateKey)return null
    const ec_1 = new EC.ec('secp256k1');
    const userKeyPairObject = ec_1.keyFromPrivate(userPrivateKey, 'hex')

    const userKeyPair ={
        "publicKey":userKeyPairObject.getPublic('hex') || '',
        "privateKey":userKeyPairObject.getPrivate('hex') || ''
    }
    return userKeyPair ? userKeyPair : null
}

export const recoverUserData = () =>{

    const username = sessionStorage.getItem(usernameString)
    const dataId = sessionStorage.getItem(userIdString)


    const recoverData = {"username":username,
                         "id":dataId}
    return recoverData ? recoverData : null
}

export const recoverToken = () =>{
    const userToken = sessionStorage.getItem(userTokenString)
    return userToken ? userToken : null
}

export const recoverGroup = () =>{
    const membersId = sessionStorage.getItem(groupUsersIdString);
    const groupName = sessionStorage.getItem(groupNameString);
    const groupId = sessionStorage.getItem(groupIdString);
    
    try {
        const objectMembersId = JSON.parse(membersId);
    
        const recovedGroup = {
            "id": groupId,
            "name":groupName,
            "members":objectMembersId
        }
        return recovedGroup
    } catch (error) {
        console.log(error)   
    }
    
    
    const recovedGroup = {
        "id": groupId,
        "name":groupName,
        "members":{}
    }

    return recovedGroup ? recovedGroup : null
}

export const defineUserKeyPair = (privateKey, publicKey) =>{
    sessionStorage.setItem(userPrivateKeyString, privateKey);
    sessionStorage.setItem(userPublicKeyString, publicKey);
}

export const defineUserData = (username, userId) =>{
    sessionStorage.setItem(usernameString, username);
    sessionStorage.setItem(userIdString, userId);
}

export const defineToken = (token) =>{
    sessionStorage.setItem(userTokenString, token);
}

export const defineReceiver = (receiver) =>{
    sessionStorage.setItem(receiverUsernameString, receiver["username"]);
    sessionStorage.setItem(receiverIdString, receiver["id"]);
    sessionStorage.setItem(receiverPublicKeyString, receiver["public_key"]);
    sessionStorage.setItem(receiverIsOnlineString, receiver["is_online"]);
}

export const defineReceiverPublicKey = (receiverPublicKey) =>{
    sessionStorage.setItem(receiverPublicKeyString, receiverPublicKey);
}

export const defineReceiverIsOnline = (receiverIsOnline) =>{
    sessionStorage.setItem(receiverIsOnlineString, receiverIsOnline);
}

export const defineGroup = (group) =>{
    let objectUsersId = group.members.reduce((obj, item) => {
    obj[item] = '';
    return obj;
    }, {});
    const  objectString = JSON.stringify(objectUsersId);
    sessionStorage.setItem(groupUsersIdString, objectString);
    sessionStorage.setItem(groupNameString, group.name);
    sessionStorage.setItem(groupIdString, group.id);
}

export const defineGroupUsersIdWithPublicKey = (objectUsersIdWithPublicKey) =>{
    const  objectString = JSON.stringify(objectUsersIdWithPublicKey);
    sessionStorage.setItem(groupUsersIdString, objectString);
}

export const removeReceiver = () => {
    sessionStorage.removeItem(receiverUsernameString);
    sessionStorage.removeItem(receiverIdString);
    sessionStorage.removeItem(receiverPublicKeyString);
    sessionStorage.removeItem(receiverIsOnlineString);
}

export const defineGroupUsers = () =>{


}