package com.csaui5.info;

import java.util.ArrayList;

import com.csaui5.World;
import com.csaui5.user.BM;
import com.csaui5.user.BMCriteria;
import com.csaui5.user.BMUser;
import com.csaui5.user.BMUserCriteria;
import com.csaui5.user.LoginState;
import com.csaui5.user.UserDataAgent;

public class InfoReportA {
	private boolean debug = false;
	private String[] allchannels;
	private BM[] bmtitles;
	private InfoBM[] infbms;
	private InfoBMChannel[] infbmchannels;
	private BMUser[] bmusers;

	public void load(LoginState ls, String start, String end, String ctgid) throws Exception {
		InfoMgr im = new InfoMgr();
		InfoDataAgent ida = new InfoDataAgent();
		UserDataAgent uda = new UserDataAgent();
		InfoCriteria criteria = new InfoCriteria();
		criteria.setStart(start);
		criteria.setEnd(end);
		criteria.setCtgid(ctgid);// 政务信息
		criteria.setFlow("1");
		criteria.setSelectStr("inf.id,inf.title,inf.channel,inf.cuserid,inf.xingzhi,u.realname as cusername");
		// criteria.setShowCrtUserBM(1);

		BMUserCriteria bucriteria = new BMUserCriteria();
		//bucriteria.setUsebmwherestr(1);
		bmusers = uda.selectBMUsers(ls, bucriteria);

		BMCriteria bmcriteria = new BMCriteria();
		//bmcriteria.setNocontaintreepath("db37f66c-74fd-4ff4-8396-69c20c0b4403");
		bmcriteria.setWherestr("and id not in ('d584e20d-8b44-4d4d-9c8b-f180f05a9b02','db37f66c-74fd-4ff4-8396-69c20c0b4403')");
		bmtitles = uda.selectBMs(ls, bmcriteria);
		allchannels = im.getAllChannels(ls);
		Info[] data = ida.selectInfos(ls, criteria, null);
		{
			ArrayList<InfoBM> list = new ArrayList<InfoBM>();
			for (int i = 0; i < data.length; i++) {
				BMUser bmuser = findBMUser(data[i]);
				InfoBM item = null;
				
				if (bmuser != null) {
					for (int r = 0; r < list.size(); r++) {
						if (list.get(r).getBmid().contentEquals(bmuser.getBmid())) {
							item = list.get(r);
							break;
						}
					}

					if (item == null) {
						item = new InfoBM();
						item.setBmid(bmuser.getBmid());
						item.setBmtitle(bmuser.getBmtitle());
						item.setCount(1);
						list.add(item);
					} else {
						item.setCount(item.getCount() + 1);
					}
				}
			}
			infbms = new InfoBM[list.size()];
			list.toArray(infbms);
		}

		{
			ArrayList<InfoBMChannel> list = new ArrayList<InfoBMChannel>();
			for (int i = 0; i < data.length; i++) {
				BMUser bmuser = findBMUser(data[i]);
				if (bmuser != null) {
					InfoBMChannel item = null;
					for (int r = 0; r < list.size(); r++) {
						if (list.get(r).getBmid().contentEquals(bmuser.getBmid())
								&& list.get(r).getChannel().contentEquals(data[i].getChannel())) {
							item = list.get(r);
							break;
						}
					}
					if (item == null) {
						item = new InfoBMChannel();
						item.setBmid(bmuser.getBmid());
						item.setBmtitle(bmuser.getBmtitle());
						item.setChannel(data[i].getChannel());
						item.setCount(1);
						list.add(item);
					} else {
						item.setCount(item.getCount() + 1);
					}
				}
			}
			infbmchannels = new InfoBMChannel[list.size()];
			list.toArray(infbmchannels);
		}
	}

	public String toHtml() {
		StringBuffer strb = new StringBuffer();
		strb.append("<html>");
		strb.append("<head>");
		strb.append("<title>信息发布统计</title>");
		strb.append("<style>");
		strb.append("body{padding:0px;margin:0px;}");
		strb.append("table {\r\n" + "	        border-collapse: collapse;\r\n" + "	    }\r\n"
				+ "	    table th, table td {\r\n" + "	    	border:1px solid silver;\r\n"
				+ "	    	padding: 6px;\r\n" + "    	    white-space: nowrap;\r\n"
				+ "    	    text-align:center;\r\n" + "	    }");
		strb.append("</style>");
		strb.append("</head>");
		strb.append("<body>");
		strb.append("<table>");
		strb.append("<tr>");
		strb.append("<th>科室</th>");
		for (int i = 0; i < allchannels.length; i++) {
			strb.append("<th>" + allchannels[i] + "</th>");
		}
		strb.append("<th>录用量</th>");
		strb.append("<th>小计</th>");
		strb.append("</tr>");
		for (int r = 0; r < bmtitles.length; r++) {
			int zwnwCount = 0;
			strb.append("<tr><td>" + bmtitles[r].getTitle() + "</td>");
			for (int i = 0; i < allchannels.length; i++) {
				boolean hasFind = false;
				for (int x = 0; x < infbmchannels.length; x++) {
					if (infbmchannels[x].getBmtitle().contentEquals(bmtitles[r].getTitle())
							&& infbmchannels[x].getChannel().contains(allchannels[i])) {
						// total += infbmchannels[x].getCount();
						strb.append("<td>" + infbmchannels[x].getCount() + "</td>");
						if(infbmchannels[x].getChannel().contentEquals("政务内网")) {
							zwnwCount = infbmchannels[x].getCount();
						}
						hasFind = true;
						break;
					}
				}
				if (!hasFind) {
					strb.append("<td>&nbsp;</td>");
				}
			}
			
			int bmtotalcount = getBMTotalCount(bmtitles[r].getTitle());
			/*double lylrate = 0;
			if(bmtotalcount > 0) {
				lylrate = (double)zwnwCount / (double)bmtotalcount;
			}*/
			strb.append("<td style=''>" + zwnwCount + "</td>");
			strb.append("<td style='font-weight:bold;'>" + bmtotalcount + "</td>");
			strb.append("</tr>");
		}
		strb.append("</table>");
		strb.append("</body>");
		strb.append("</html>");
		return strb.toString();
	}
	
	
	private int getBMTotalCount(String bm) {
		for (int i = 0; i < infbms.length; i++) {
			if (infbms[i].getBmtitle().contentEquals(bm)) {
				return infbms[i].getCount();
			}
		}
		return 0;
	}
	//是否为党团部门
	private boolean isDangTuanBM(String bmid) {
		for(BM bm:bmtitles) {
			if(bm.getId().contentEquals(bmid) && bm.getTreepath().contains("db37f66c-74fd-4ff4-8396-69c20c0b4403")) {
				return true;
			}
		}
		return false;
	}
	
	private BM getBM(String bmid) {
		for(BM bm:bmtitles) {
			if(bm.getId().contentEquals(bmid)) {
				return bm;
			}
		}
		return null;
	}
	//获取用户在这条信息里所属得部门（看性质决定）
	private BMUser findBMUser(Info info) {
		for (int i = 0; i < bmusers.length; i++) {
			if (bmusers[i].getId().contentEquals(info.getCuserid())) {
				if(isDangTuanBM(bmusers[i].getBmid())) {
					if(info.getXingzhi() == 1) {
						if(debug) World.logToConsole("dtxz1 " + info.getCusername() + " " + getBM(bmusers[i].getBmid()).getTitle() + " " + info.getTitle());
						return bmusers[i];
					}
					else {
						if(debug) World.logToConsole("dtxz0(no) " + info.getCusername() + " " + getBM(bmusers[i].getBmid()).getTitle() + " " + info.getTitle());
					}
				}
				else {
					if(info.getXingzhi() == 0) {
						if(debug) World.logToConsole("ndtxz0 " + info.getCusername() + " " + getBM(bmusers[i].getBmid()).getTitle() + " " + info.getTitle());
						return bmusers[i];
					}
					else {
						if(debug) World.logToConsole("ndtxz1(no) " + info.getCusername() + " " + getBM(bmusers[i].getBmid()).getTitle() + " " + info.getTitle());
					}
				}
			}
		}
		return null;
	}

	public String[] getAllchannels() {
		return allchannels;
	}

	public void setAllchannels(String[] allchannels) {
		this.allchannels = allchannels;
	}

	public InfoBMChannel[] getInfbmchannels() {
		return infbmchannels;
	}

	public void setInfbmchannels(InfoBMChannel[] infbmchannels) {
		this.infbmchannels = infbmchannels;
	}

}
