package com.csaui5.info;

import java.util.ArrayList;

import com.csaui5.flow.ShenPiFlowPlan;
import com.csaui5.helper.ModelingHelper;
import com.csaui5.helper.StringHelper;
import com.csaui5.kaoqin.BM001;
import com.csaui5.user.BMUser;
import com.csaui5.user.BMUserCriteria;
import com.csaui5.user.LoginState;
import com.csaui5.user.User;
import com.csaui5.user.ZzjgMgr;

// 行政工作
// 政务信息：一共三审，1审科长，2审分管，3审办公室（如果1审时点击可发就能直接跳到办公室）
// 其他：一共一审
// （废弃）政务信息：一共二审，1审是科长2审是办公室
public class InfoShenPiMgr implements IInfoShenPiMgr {
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

	// 获取审批流计划
	public ShenPiFlowPlan getShenPiFlowPlan(LoginState ls, String userid, int shenpicount) throws Exception {
		ModelingHelper mh = new ModelingHelper();
		CtgMgr ctgMgr = new CtgMgr();
		ZzjgMgr zzjgMgr = new ZzjgMgr();
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
		if (sqr.getLevel() == 0 || sqr.getLevel() == 4) {// 科员一审
			// 获取一审人（在部门中寻找无审批权成员）
			for (int i = 0; i < allbmusers.length; i++) {
				for (int i1 = 0; i1 < mybmusers.length; i1++) {
					BMUser shenpi1user = allbmusers[i];
					// 寻找我没审批权的部门
					if (shenpi1user.getBmid().equals(mybmusers[i1].getBmid()) && shenpi1user.getKaoqinshenpi() == 1
							&& !shenpi1user.getId().equals(sqr.getId())) {
						if (StringHelper.isNullOrEmpty(shenpi1userid)) {
							shenpi1bmid = shenpi1user.getBmid();
							shenpi1userid = shenpi1user.getId();
							shenpi1username = shenpi1user.getRealname();
						} else {
							if (shenpi1userid.contains(shenpi1user.getId())) {
								// 防止重复添加
							} else {
								shenpi1userid += "," + shenpi1user.getId();
								shenpi1username += "," + shenpi1user.getRealname();
							}
						}
					}
				}
			}
		} else if (sqr.getLevel() == 1) {// 副科长一审
			// 获取一审人（申请人是无审批权的副科长）
			for (int i = 0; i < allbmusers.length; i++) {
				for (int i1 = 0; i1 < mybmusers.length; i1++) {
					BMUser shenpi1user = allbmusers[i];
					// 寻找我没审批权的部门；==============审批人不能和自己同级
					if (shenpi1user.getBmid().equals(mybmusers[i1].getBmid()) && shenpi1user.getKaoqinshenpi() == 1
							&& !shenpi1user.getId().equals(sqr.getId())) {// && shenpi1user.getUserlevel() !=
																			// sqr.getLevel()
						if (StringHelper.isNullOrEmpty(shenpi1userid)) {
							shenpi1bmid = shenpi1user.getBmid();
							shenpi1userid = shenpi1user.getId();
							shenpi1username = shenpi1user.getRealname();
						} else {
							if (shenpi1userid.contains(shenpi1user.getId())) {
								// 防止重复添加
							} else {
								shenpi1userid += "," + shenpi1user.getId();
								shenpi1username += "," + shenpi1user.getRealname();
							}
						}
					}
				}
			}
			// 获取一审人（申请人是由审批权的副科长）
			if (StringHelper.isNullOrEmpty(shenpi1userid)) {
				for (int i = 0; i < mybmusers.length; i++) {
					// 寻找我有审批权的部门，然后再找到对应的分管领导
					if (mybmusers[i].getKaoqinshenpi() == 1) {
						String pbmid = getParentBMId(mybmusers[i].getBmid(), bms);
						for (int i1 = 0; i1 < allbmusers.length; i1++) {
							BMUser shenpi1user = allbmusers[i1];
							if (shenpi1user.getBmid().equals(pbmid) && shenpi1user.getKaoqinshenpi() == 1) {
								if (StringHelper.isNullOrEmpty(shenpi1userid)) {
									shenpi1bmid = shenpi1user.getBmid();
									shenpi1userid = shenpi1user.getId();
									shenpi1username = shenpi1user.getRealname();
								} else {
									if(shenpi1userid.contains(shenpi1user.getId())) {
										//防止重复添加
									}
									else {
										shenpi1userid += "," + shenpi1user.getId();
										shenpi1username += "," + shenpi1user.getRealname();
									}
								}
							}
						}
					}
				}
			}
		} else if (sqr.getLevel() == 2) {// 科长一审
			for (int i = 0; i < mybmusers.length; i++) {
				// 寻找我有审批权的部门，然后再找到对应的分管领导
				if (mybmusers[i].getKaoqinshenpi() == 1) {
					String pbmid = getParentBMId(mybmusers[i].getBmid(), bms);
					for (int i1 = 0; i1 < allbmusers.length; i1++) {
						BMUser shenpi1user = allbmusers[i1];
						if (shenpi1user.getBmid().equals(pbmid) && shenpi1user.getKaoqinshenpi() == 1) {
							if (StringHelper.isNullOrEmpty(shenpi1userid)) {
								shenpi1bmid = shenpi1user.getBmid();
								shenpi1userid = shenpi1user.getId();
								shenpi1username = shenpi1user.getRealname();
							} else {
								if(shenpi1userid.contains(shenpi1user.getId())) {
									//防止重复添加
								}
								else {
									shenpi1userid += "," + shenpi1user.getId();
									shenpi1username += "," + shenpi1user.getRealname();
								}
							}
						}
					}
				}
			}
		}
		else if(sqr.getLevel() == 3) {// 分管领导一审
			for (int i = 0; i < allbmusers.length; i++) {
				//for (int i1 = 0; i1 < mybmusers.length; i1++) {
					BMUser shenpi1user = allbmusers[i];
					// 寻找我没审批权的部门
					if (shenpi1user.getBmtitle().contentEquals("虚拟处长室") /*&& shenpi1user.getBmid().equals(mybmusers[i1].getBmid())*/ && shenpi1user.getKaoqinshenpi() == 1
							&& !shenpi1user.getId().equals(sqr.getId()) /*&& shenpi1user.getUserlevel() != sqr.getLevel()*/) {
						if (StringHelper.isNullOrEmpty(shenpi1userid)) {
							shenpi1bmid = shenpi1user.getBmid();
							shenpi1userid = shenpi1user.getId();
							shenpi1username = shenpi1user.getRealname();
						} else {
							if(shenpi1userid.contains(shenpi1user.getId())) {
								//防止重复添加
							}
							else {
								shenpi1userid += "," + shenpi1user.getId();
								shenpi1username += "," + shenpi1user.getRealname();
							}
						}
					}
				//}
			}

			if (StringHelper.isNullOrEmpty(shenpi1userid)) {
				for (int i = 0; i < allbmusers.length; i++) {
					for (int i1 = 0; i1 < mybmusers.length; i1++) {
						BMUser shenpi1user = allbmusers[i];
						// 寻找我没审批权的部门
						if (shenpi1user.getBmid().equals(mybmusers[i1].getBmid()) && shenpi1user.getKaoqinshenpi() == 1
								&& !shenpi1user.getId().equals(sqr.getId()) && shenpi1user.getUserlevel() != sqr.getLevel()) {
							if (StringHelper.isNullOrEmpty(shenpi1userid)) {
								shenpi1bmid = shenpi1user.getBmid();
								shenpi1userid = shenpi1user.getId();
								shenpi1username = shenpi1user.getRealname();
							} else {
								if(shenpi1userid.contains(shenpi1user.getId())) {
									//防止重复添加
								}
								else {
									shenpi1userid += "," + shenpi1user.getId();
									shenpi1username += "," + shenpi1user.getRealname();
								}
							}
						}
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
		//if (!shenpi1bmid.contentEquals("610bb191-ee5c-49f0-a323-8929d8da97a4")) {
			// 获取二审人
			if (sqr.getLevel() == 0 || sqr.getLevel() == 1) {// 科员，副科长
				String pbmid = getParentBMId(shenpi1bmid, bms);
				for (int i = 0; i < allbmusers.length; i++) {
					BMUser shenpi2user = allbmusers[i];
					if (shenpi2user.getBmid().equals(pbmid) && shenpi2user.getKaoqinshenpi() == 1) {// 找到一审领导父级部门有审批权的人
						if (StringHelper.isNullOrEmpty(shenpi2userid)) {
							shenpi2bmid = shenpi2user.getBmid();
							shenpi2userid = shenpi2user.getId();
							shenpi2username = shenpi2user.getRealname();
						} else {
							if(shenpi2userid.contains(shenpi2user.getId())) {
								//防止重复添加
							}
							else {
								shenpi2userid += "," + shenpi2user.getId();
								shenpi2username += "," + shenpi2user.getRealname();
							}
						}
					}
				}
			} else if (sqr.getLevel() == 2 || sqr.getLevel() == 3) {// 科长，分管
				for (int i = 0; i < allbmusers.length; i++) {
					BMUser shenpiuser = allbmusers[i];
					// 寻找办公室里有审批权的
					if (shenpiuser.getBmid().equals("610bb191-ee5c-49f0-a323-8929d8da97a4")
							&& shenpiuser.getInfoshenpi() == 1 && !shenpiuser.getId().equals(sqr.getId())) {
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
			}

			if (!StringHelper.isNullOrEmpty(shenpi2userid)) {
				plan.setShenpi2userids(new String[] { shenpi2userid });
				plan.setShenpi2usernames(new String[] { shenpi2username });
			} else {
				plan.setShenpi2userids(new String[] {});
				plan.setShenpi2usernames(new String[] {});
			}
		//}
	}

	protected void setShenpi3(ShenPiFlowPlan plan, User sqr, BMUser[] mybmusers, BMUser[] allbmusers, BM001[] bms) {
		for (int i = 0; i < allbmusers.length; i++) {
			BMUser shenpiuser = allbmusers[i];
			// 寻找办公室里有审批权的
			if (shenpiuser.getBmtitle().contentEquals("办公室")//.getBmid().equals("610bb191-ee5c-49f0-a323-8929d8da97a4")
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
