import { useRef } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  height: 100%;
  padding: 20px;
`

const Textfield = styled.textarea`
  width: calc((100% - 100px) / 2);
`

const Controllers = styled.div`
  width: 100px;
  display: flex;
  flex-direction: column;
  padding: 10px;
`

const ReviewPreprocessor = {
  targetId: (x) => x,
  boardId: (x) => x,
  categoryTitle: (x) => x,
  image: (x) => 'https://asset.goodoc.kr/board/picture/20210503/' + x,
  videoThumbnail: (x) =>
    'https://s3.ap-northeast-2.amazonaws.com/asset.goodoc.kr/clinicmarket/' + x,
  file_boardId: (x) => x,
  file_fileName: (x) => 'https://asset.goodoc.kr/board/picture/20210503/' + x,
  file_id: (x) => x,
  hospitalName: (x) => x,
  userName: (x) => x,
  contents: (x) => x,
  rateSum: (x) => parseFloat(x),
  regDate: (x) => x,
}

const reviewPostProcessor = (input) => {
  const file = {
    boardId: input.file_boardId,
    fileName: input.file_fileName,
    id: input.file_id,
  }
  delete input.file_boardId
  delete input.file_fileName
  delete input.file_id

  return Object.assign(input, { file: [file] })
}

export const Home = (): JSX.Element => {
  const sourceRef = useRef(null)
  const resultRef = useRef(null)

  const handleConvert = () => {
    const sourceText = sourceRef.current.value
    const lines = sourceText.split(/\n/)

    const header = lines.shift().split(/\t/)

    const result = lines.map((line) => {
      const data = line.split(/\t/)

      const mappingResult = Object.keys(ReviewPreprocessor).reduce(
        (acc, key) => {
          acc[key] = ReviewPreprocessor[key](data[header.indexOf(key)])
          return acc
        },
        {}
      )

      return reviewPostProcessor(mappingResult)
    })

    console.log(result)

    resultRef.current.value = JSON.stringify(result)
  }

  return (
    <Container>
      <Textfield ref={sourceRef} />
      <Controllers>
        <button onClick={() => handleConvert()}>convert!</button>
      </Controllers>
      <Textfield ref={resultRef} />
    </Container>
  )
}

export default Home
