export default function ErrorList({ errorMsg, onClick }) {
    return (
        <div>
            <div>
                <strong>エラーが発生しました</strong>
                {errorMsg}
                <br />
                <br />
                <small>APIキーの確認をしてください</small>
            </div>
            <button onClick={onClick}>やり直す</button>
        </div>
    )
}