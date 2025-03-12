interface EmptyStateComponentProps {
    imgageUrl: string,
    size: number,
    message: string
}
const EmptyStateComponent = ({ imgageUrl, size, message }: EmptyStateComponentProps) => {
    return (
        <div className='w-full flex flex-col space-y-6 justify-center items-center'>
            <img src={imgageUrl} height={size} width={size} alt='empty'></img>
            <div className='text-xl font-medium text-slate-400'>{message}</div>
        </div>
    )
}

export default EmptyStateComponent
