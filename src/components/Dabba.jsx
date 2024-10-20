function Dabba(props) {
    return (
        <button class={`m-3 w-fit border-black border-4 rounded-xl text-center text-5xl py-5 px-40 ${props.yellow ? 'bg-sun' : 'bg-white'}`}>
            <h1> Login </h1>
            {props.background}
        </button >
    )
}
export default Dabba;