package com.csaui5;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import com.csaui5.db.syscmd.DBAutoBakFSysCmd;
import com.csaui5.kaoqin.syscmd.DataSyncForeverCommand1;
import com.csaui5.syscmd.OnceCommandDemo;

public class ContextListener implements ServletContextListener {
	public void contextInitialized(ServletContextEvent event) {
		// web应用初始化
        ServletContext sc = event.getServletContext();
        World t = World.getInstance();
        t.init(sc);
        World.setNoLogConMatches(new com.csaui5.sys.SysMgr().getCfg().getNoLogConMatch());
        // 添加永久指令
        //t.getCmdExecBox().addToForeverQueue(new ForeverCommandDemo());// 测试 
        t.getCmdExecBox().addToForeverQueue(new DBAutoBakFSysCmd());// 数据库自动备份
        t.getCmdExecBox().addToForeverQueue(new DataSyncForeverCommand1());// 考勤数据同步
		World.log("(CEB)共加载单次" + t.getCmdExecBox().getOnceExecQueueCount() + "个，永久" + t.getCmdExecBox().getForeverQueueCount() + "个");
		t.getCmdExecBox().addToOnceQueue(new OnceCommandDemo());
        t.getCmdExecBox().start();
    }
    
    public void contextDestroyed(ServletContextEvent event) {
        // web应用停止
        World t = World.getInstance();
    	t.stop();
    	t.destroy();
    }
}
