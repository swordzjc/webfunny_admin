import "./index.scss"
import React, { Component } from "react"
import Header from "Components/header"
import { Row, Col, Tabs, Card, Icon } from "antd"
import { jsErrorOption } from "ChartConfig/jsChartOption"
const TabPane = Tabs.TabPane
const echarts = require("echarts")
class JavascriptError extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(document.getElementById("jsErrorCountByDay"))
    // 绘制图表
    this.props.getJsErrorCountByDayAction((result) => {
      const data = result.data
      const dateArray = [], jsErrorArray = []
      for (let i = 0; i < 30; i ++) {
        dateArray.push(data[i].day)
        jsErrorArray.push(data[i].count)
      }
      myChart.setOption(jsErrorOption([dateArray, jsErrorArray]))
    })

    // 获取js错误列表
    this.props.getJsErrorSortAction((result) => {
      this.props.updateJavascriptErrorState({jsErrorList: result.data})
    })

    this.props.getJavascriptErrorCountByOsAction((result) => {
      const pcError = parseInt(result.pcError.count, 10)
      const iosError = parseInt(result.iosError.count, 10)
      const androidError = parseInt(result.androidError.count, 10)
      const pcPv = parseInt(result.pcPv.count, 10)
      const iosPv = parseInt(result.iosPv.count, 10)
      const androidPv = parseInt(result.androidPv.count, 10)

      const errorTotal = pcError + iosError + androidError
      const pvTotal = pcPv + iosPv + androidPv

      const totalPercent = (errorTotal * 100 / pvTotal).toFixed(2)
      const pcPercent = (pcError * 100 / pcPv).toFixed(2)
      const iosPercent = (iosError * 100 / iosPv).toFixed(2)
      const androidPercent = (androidError * 100 / androidPv).toFixed(2)
      this.props.updateJavascriptErrorState({totalPercent, pcPercent, iosPercent, androidPercent})
    })
    // setInterval(function () {
    //   a = b + c
    // }, 5000)
  }

  render() {
    const { jsErrorList, totalPercent, pcPercent, iosPercent, androidPercent } = this.props
    return <div className="javascriptError-container">
      <Header/>
      <Row>
        <Card className="main-info-container">
          <Col span={16}>
            <Tabs defaultActiveKey="1" >
              <TabPane tab={<span><Icon type="area-chart" />月统计</span>} key="1">
                <div id="jsErrorCountByDay" className="chart-box" />
              </TabPane>
              <TabPane tab={<span><Icon type="clock-circle" />实时统计</span>} key="2">
                <div id="jsErrorCountByHour" className="chart-box" >
                  即将完善
                </div>
              </TabPane>
            </Tabs>
          </Col>
          <Col span={8}>
            <Tabs defaultActiveKey="1" >
              <TabPane tab={<span><Icon type="file-text" />信息概览</span>} key="1">
                <div className="info-box">
                  <span><Icon type="exception" /><label>错误率</label></span>
                  <span>{totalPercent}%</span>
                </div>
                <div className="info-box">
                  <span><Icon type="ie" /><label>PC</label></span>
                  <span>{pcPercent}%</span>
                </div>
                <div className="info-box">
                  <span><Icon type="apple" /><label>IOS</label></span>
                  <span>{iosPercent}%</span>
                </div>
                <div className="info-box">
                  <span><Icon type="android" /><label>Android</label></span>
                  <span>{androidPercent}%</span>
                </div>
              </TabPane>
            </Tabs>
          </Col>
        </Card>

      </Row>
      <Row>
        <Tabs defaultActiveKey="1" >
          <TabPane tab={<span><Icon type="tags-o" />错误列表</span>} key="1">
            <Card className="error-list-container">
              {
                jsErrorList.map((error, index) => {
                  const msgArr = error.errorMessage.split(": ")
                  const len = msgArr.length
                  return <p key={index} onClick={this.turnToDetail.bind(this, error)}><span className="status-icon"/><span>{msgArr[0] || "空"}</span><span>{msgArr[len - 1] || "..."}</span><span>({error.count}次)</span><Icon className="click-export" type="export" /><span><i>最近：</i>2018.11.11</span></p>
                })
              }
            </Card>
          </TabPane>
          <TabPane tab={<span><Icon type="switcher" />错误页面</span>} key="2">
            <div id="jsErrorByPage" className="chart-box" >
              即将完善
            </div>
          </TabPane>
        </Tabs>

      </Row>
    </div>
  }
  turnToDetail(error) {
    this.props.history.push("javascriptErrorDetail?errorMsg=" + error.errorMessage)
  }
}

JavascriptError.propTypes = {
}

export default JavascriptError
