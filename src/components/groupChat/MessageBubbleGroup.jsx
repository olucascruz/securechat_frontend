import styled from 'styled-components';


const MessageBubbleReceiverStyle = styled.li`
    display: flex;
    flex-direction: column;
    min-height: 80px;
    height: auto;
    width: 40%;
    margin-right: auto;
    margin-bottom: 15px;
    background-color: #f0f8ff7b;
    align-items: center;
    border-bottom-right-radius:25px;
    .received{
        margin-top: 5px;
        margin-right: 10px;
        margin-left: auto;
    }
`
const MessageBubbleSenderStyle = styled.li`
    display: flex;
    flex-direction: column;
    min-height: 80px;
    height: auto;
    width: 40%;
    margin-left: auto;
    margin-bottom: 15px;
    background-color: #d9d9d9b7;
    justify-content: center ;
    align-items: center;
    border-bottom-left-radius:25px;
    .sender{
        margin-left: 25px;
        margin-right: auto;
    }
`

const MessageBubbleText = styled.span`
    word-wrap: break-word; /* Para navegadores mais antigos */
    overflow-wrap: anywhere;
    font-size: 25px;
`
const NameSender = styled.span`
    font-weight: bold;
    margin-left: auto;
    margin-right:20px;
    font-size: 18px;
`

function MessageBubbleGroup({username, index, message}){

    return(
        <>
        {message.username == username ? 
        <MessageBubbleSenderStyle key={index}>
            <MessageBubbleText className='sender'>
                {message.message}
            </MessageBubbleText>
            </MessageBubbleSenderStyle>
        :
        <MessageBubbleReceiverStyle key={index}>
        <NameSender>{message.username}</NameSender>
        <MessageBubbleText className='received'>
           {message.message}
        </MessageBubbleText >
        </MessageBubbleReceiverStyle>
        }
        
        
        </>
        )
}

export default MessageBubbleGroup