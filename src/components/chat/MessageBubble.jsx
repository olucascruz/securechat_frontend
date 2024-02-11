import styled from 'styled-components';


const MessageBubbleReceiverStyle = styled.li`
    display: flex;
    min-height: 80px;
    height: auto;
    width: 40%;
    margin-right: auto;
    margin-bottom: 15px;
    background-color: #f0f8ff7b;
    justify-content: flex-end;
    align-items: center;
    border-bottom-right-radius:25px;
    .receiver{
        margin-right: 10px;
    }
`
const MessageBubbleSenderStyle = styled.li`
    display: flex;
    min-height: 80px;
    height: auto;
    width: 40%;
    margin-left: auto;
    margin-bottom: 15px;
    background-color: #d9d9d9b7;
    justify-content: flex-start;
    align-items: center;
    border-bottom-left-radius:25px;
    .sender{
        margin-left: 25px;
    }
`

const MessageBubbleText = styled.span`
    word-wrap: break-word; /* Para navegadores mais antigos */
    overflow-wrap: anywhere;
    font-size: 25px;
`

function MessageBubble({username, index, message}){

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
        <MessageBubbleText className='receiver'>
           {message.message}
        </MessageBubbleText >
        </MessageBubbleReceiverStyle>
        }
        
        
        </>
        )
}

export default MessageBubble