package com.csaui5.info;

import java.util.ArrayList;

import com.csaui5.flow.ShenPiFlowPlan;
import com.csaui5.helper.ModelingHelper;
import com.csaui5.helper.StringHelper;
import com.csaui5.kaoqin.BM001;
import com.csaui5.user.BMUser;
import com.csaui5.user.BMUserCriteria;
import com.csaui5.user.LoginState;
import com.csaui5.user.RoleUserMap;
import com.csaui5.user.User;
import com.csaui5.user.UserDataAgent;
import com.csaui5.user.ZzjgMgr;

// 党团工作
// 政务信息：一共三审，1审 夏雅君，2审 曹美琴，3审 施杨
public class InfoShenPiMgr1 implements IInfoShenPiMgr {
	@SuppressWarnings("unused")
	private String shenpi1bmid = "";
	private String shenpi1userid = "";
	private String shenpi1username = "";

	@SuppressWarnings("unused")
	private String shenpi2bmid = "";
	private String shenpi2userid = "";
	private String shenpi2username = "";

	@SuppressWarnings("unused")
	private String shenpi3bmid = "";
	private String shenpi3userid = "";
	private String shenpi3username = "";

	private RoleUserMap[] roleUserMaps;

	// 获取审批流计划
	public ShenPiFlowPlan getShenPiFlowPlan(LoginState ls, String userid, int shenpicount) throws Exception {
		ModelingHelper mh = new ModelingHelper();
		CtgMgr ctgMgr = new CtgMgr();
		ZzjgMgr zzjgMgr = new ZzjgMgr();
		UserDataAgent uda = new UserDataAgent();
		ShenPiFlowPlan plan = new ShenPiFlowPlan();

		// 加载数据
		User sqr = new User();
		sqr.setId(userid);
		zzjgMgr.selectUserForm(sqr);

		// 加载所有部门
		CtgCriteria ctgCriteria = new CtgCriteria();
		ctgCriteria.setPtype("bm");
		ctgCriteria.setHide(-1);
		ctgCriteria.setNolimit(1);
		Ctg[] t_bms = ctgMgr.selectCtgs(ls, ctgCriteria);
		BM001[] bms = new BM001[t_bms.length];
		for (int i = 0; i < t_bms.length; i++) {
			BM001 bm = new BM001();
			mh.transferObj1ToObj2(t_bms[i], bm);
			bms[i] = bm;
		}

		// 加载包含我的部门用户
		BMUser[] mybmusers = null;
		{
			BMUserCriteria criteria = new BMUserCriteria();
			criteria.setUserid(userid);
			mybmusers = zzjgMgr.selectBMUsers(ls, criteria);
		}

		// 加载所有部门用户
		BMUser[] allbmusers = null;
		{
			BMUserCriteria criteria = new BMUserCriteria();
			allbmusers = zzjgMgr.selectBMUsers(ls, criteria);
		}

		// 加载角色人员映射
		roleUserMaps = uda.selectAllRoleUserMaps(ls);

		buildBM001s(bms, allbmusers);

		/*** 一审 ***/
		if (shenpicount >= 1) {
			setShenpi1(plan, sqr, mybmusers, allbmusers, bms);
		}
		/*** 二审 ***/
		if (shenpicount >= 2) {
			//
			setShenpi2(plan, sqr, mybmusers, allbmusers, bms);
		}
		/*** 三审 ***/
		if (shenpicount >= 3) {
			setShenpi3(plan, sqr, mybmusers, allbmusers, bms);
		}

		return plan;
	}

	protected void setShenpi1(ShenPiFlowPlan plan, User sqr, BMUser[] mybmusers, BMUser[] allbmusers, BM001[] bms) {
		for (int i = 0; i < allbmusers.length; i++) {
			BMUser shenpiuser = allbmusers[i];
			if (isRoleUser(shenpiuser.getId(), "信息党团一审")) {
				if (StringHelper.isNullOrEmpty(shenpi1userid)) {
					shenpi1bmid = shenpiuser.getBmid();
					shenpi1userid = shenpiuser.getId();
					shenpi1username = shenpiuser.getRealname();
				} else {
					if (shenpi1userid.contains(shenpiuser.getId())) {
						// 防止重复添加
					} else {
						shenpi1userid += "," + shenpiuser.getId();
						shenpi1username += "," + shenpiuser.getRealname();
					}
				}
			}
		}

		if (!StringHelper.isNullOrEmpty(shenpi1userid)) {
			plan.setShenpi1userids(new String[] { shenpi1userid });
			plan.setShenpi1usernames(new String[] { shenpi1username });
		} else {
			plan.setShenpi1userids(new String[] {});
			plan.setShenpi1usernames(new String[] {});
		}
	}

	protected void setShenpi2(ShenPiFlowPlan plan, User sqr, BMUser[] mybmusers, BMUser[] allbmusers, BM001[] bms) {
		for (int i = 0; i < allbmusers.length; i++) {
			BMUser shenpiuser = allbmusers[i];
			if (isRoleUser(shenpiuser.getId(), "信息党团二审")) {
				if (StringHelper.isNullOrEmpty(shenpi2userid)) {
					shenpi2bmid = shenpiuser.getBmid();
					shenpi2userid = shenpiuser.getId();
					shenpi2username = shenpiuser.getRealname();
				} else {
					if (shenpi2userid.contains(shenpiuser.getId())) {
						// 防止重复添加
					} else {
						shenpi2userid += "," + shenpiuser.getId();
						shenpi2username += "," + shenpiuser.getRealname();
					}
				}
			}
		}

		if (!StringHelper.isNullOrEmpty(shenpi2userid)) {
			plan.setShenpi2userids(new String[] { shenpi2userid });
			plan.setShenpi2usernames(new String[] { shenpi2username });
		} else {
			plan.setShenpi2userids(new String[] {});
			plan.setShenpi2usernames(new String[] {});
		}
	}

	protected void setShenpi3(ShenPiFlowPlan plan, User sqr, BMUser[] mybmusers, BMUser[] allbmusers, BM001[] bms) {
		for (int i = 0; i < allbmusers.length; i++) {
			BMUser shenpiuser = allbmusers[i];
			// 寻找办公室里有审批权的
			if (shenpiuser.getBmtitle().contentEquals("办公室")//shenpiuser.getBmid().equals("610bb191-ee5c-49f0-a323-8929d8da97a4") 
					&& shenpiuser.getInfoshenpi() == 1 && !shenpiuser.getId().equals(sqr.getId())) {
				if (StringHelper.isNullOrEmpty(shenpi3userid)) {
					shenpi3bmid = shenpiuser.getBmid();
					shenpi3userid = shenpiuser.getId();
					shenpi3username = shenpiuser.getRealname();
				} else {
					if (shenpi3userid.contains(shenpiuser.getId())) {
						// 防止重复添加
					} else {
						shenpi3userid += "," + shenpiuser.getId();
						shenpi3username += "," + shenpiuser.getRealname();
					}
				}
			}
		}

		if (!StringHelper.isNullOrEmpty(shenpi3userid)) {
			plan.setShenpi3userids(new String[] { shenpi3userid });
			plan.setShenpi3usernames(new String[] { shenpi3username });
		} else {
			plan.setShenpi3userids(new String[] {});
			plan.setShenpi3usernames(new String[] {});
		}
	}

	private boolean isRoleUser(String userid, String roletitle) {
		for (int i = 0; i < roleUserMaps.length; i++) {
			if (roleUserMaps[i].getUserid().contentEquals(userid)
					&& roleUserMaps[i].getRoletitle().contentEquals(roletitle)) {
				return true;
			}
		}
		return false;
	}

	@SuppressWarnings("unused")
	private String getParentBMId(String bmid, Ctg[] bms) {
		Ctg bm = null;
		for (int i = 0; i < bms.length; i++) {
			if (bms[i].getId().equals(bmid)) {
				bm = bms[i];
				break;
			}
		}
		if (bm != null) {
			return bm.getPid();
		}
		return "";
	}

	private void buildBM001s(BM001[] bms, BMUser[] bmusers) {
		for (int i = 0; i < bms.length; i++) {
			ArrayList<String> useridlist = new ArrayList<String>();
			ArrayList<String> userrnlist = new ArrayList<String>();
			for (int a = 0; a < bmusers.length; a++) {
				if (bms[i].getId().equals(bmusers[a].getBmid())) {
					useridlist.add(bmusers[a].getId());
					userrnlist.add(bmusers[a].getRealname());
				}
			}
			bms[i].setBmuserids(StringHelper.toStringArr(useridlist.toArray()));
			bms[i].setBmuserrns(StringHelper.toStringArr(userrnlist.toArray()));
		}
	}
}
