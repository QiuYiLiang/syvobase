import { Meta, StoryObj } from '@storybook/react-vite'
import { FileViewer } from '@/fileViewer'

const meta = {
  title: 'Advanced/FileViewer',
  component: FileViewer,
  argTypes: {},
  args: {},
} satisfies Meta<typeof FileViewer>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    files: [
      {
        id: '1',
        name: '测试 Word.docx',
      },
      {
        id: '2',
        name: '测试音频.mp3',
      },
      {
        id: '3',
        name: '测试图片3.png',
      },
      {
        id: '4',
        name: '测试视频.mp4',
      },
      {
        id: '5',
        name: '测试 Xlsx.xlsx',
      },
      {
        id: '6',
        name: '测试 PPT.pptx',
      },
      {
        id: '7',
        name: '测试 PDF.pdf',
      },
    ],
    allowDownload: true,
    getFileUrl: ({ id }) => {
      if (id === '1') {
        return 'https://raw.githubusercontent.com/zsmhub/document_template/refs/heads/master/%E6%B5%8B%E8%AF%95%E6%8A%A5%E5%91%8A%E6%A8%A1%E6%9D%BF-%E7%AE%80%E5%8D%95%E7%89%88.docx'
      }
      if (id === '2') {
        return 'https://storage.googleapis.com/media-session/elephants-dream/the-wires.mp3'
      }
      if (id === '3') {
        return 'https://pic.netbian.com/uploads/allimg/240528/213609-17169033698cd1.jpg'
      }
      if (id === '4') {
        return 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4'
      }
      return ''
    },
  },
}
