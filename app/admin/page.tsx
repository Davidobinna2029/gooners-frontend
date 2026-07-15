import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { isAdmin } from "@/lib/permissions";

import AdminUserMenu from "@/components/admin/AdminUserMenu";
import NewsroomStats from "@/components/admin/NewsroomStats";
import NewsroomQuickActions from "@/components/admin/NewsroomQuickActions";
import NeedsReviewPanel from "@/components/admin/NeedsReviewPanel";

import WorkflowBoard from "@/components/admin/WorkflowBoard";
import OverridePanel from "@/components/admin/OverridePanel";
import HeroBoard from "@/components/admin/hero-board/HeroBoard";
import NotificationCenter from "@/components/admin/NotificationCenter";
import AuditLogViewer from "@/components/admin/AuditLogViewer";
import EditorialAnalytics from "@/components/admin/EditorialAnalytics";
import ActivityTimeline from "@/components/admin/ActivityTimeline";
import LiveNewsroomStatus from "@/components/admin/LiveNewsroomStatus";
import LivePanel from "@/components/admin/LivePanel";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const role = (session.user as any)?.role;

  if (!isAdmin(role)) {
    redirect("/login");
  }

  return (
    <main className="admin-page">
      <div className="admin-container">
        <header className="admin-header">
          <h1>ArsenalTalks Newsroom</h1>

          <p>
            Editorial workflow, homepage controls and publishing
            tools.
          </p>

          <AdminUserMenu
            email={session.user?.email ?? ""}
            role={role}
          />
        </header>

        <NewsroomStats />

        <NewsroomQuickActions />

        <NeedsReviewPanel />

        <section className="admin-grid">
          <div className="admin-main">
            <WorkflowBoard />

            <OverridePanel />

            <HeroBoard />

            <LivePanel />

            <NotificationCenter />

            <AuditLogViewer />

            <EditorialAnalytics />

            <ActivityTimeline />

            <LiveNewsroomStatus />
          </div>

          <aside className="admin-sidebar">
            <div className="admin-card">
              <h3>Logged In</h3>

              <p>{session.user?.email}</p>

              <strong>Role: {role}</strong>
            </div>

            <div className="admin-card">
              <h3>Workflow Status</h3>

              <p>
                Manage articles through Draft, Review,
                Approved and Published stages.
              </p>
            </div>

            <div className="admin-card">
              <h3>Homepage Engine</h3>

              <p>
                Editorial overrides feed directly into the
                homepage ranking engine, homepage preview,
                analytics and live newsroom updates.
              </p>
            </div>

            <div className="admin-card">
              <h3>Override Types</h3>

              <ul>
                <li>PIN_TO_HERO</li>
                <li>HERO_POSITION</li>
                <li>FORCE_BREAKING</li>
                <li>BOOST_SCORE</li>
                <li>BLOCK_POST</li>
                <li>HIDE_POST</li>
              </ul>
            </div>

            <div className="admin-card">
              <h3>Homepage Sections</h3>

              <ul>
                <li>Hero</li>
                <li>Breaking News</li>
                <li>Latest News</li>
                <li>Trending</li>
              </ul>
            </div>

            <div className="admin-card">
              <h3>Hero Controls</h3>

              <ul>
                <li>Hero #1</li>
                <li>Hero #2</li>
                <li>Hero #3</li>
                <li>Hero #4</li>
              </ul>
            </div>

            <div className="admin-card">
              <h3>Hero Ordering</h3>

              <ul>
                <li>Position #1</li>
                <li>Position #2</li>
                <li>Position #3</li>
                <li>Position #4</li>
              </ul>
            </div>

            <div className="admin-card">
              <h3>Breaking News</h3>

              <ul>
                <li>Promote Story</li>
                <li>Breaking Bar</li>
                <li>Priority Alerts</li>
              </ul>
            </div>

            <div className="admin-card">
              <h3>Editorial Analytics</h3>

              <ul>
                <li>Workflow Metrics</li>
                <li>Override Tracking</li>
                <li>Audit Activity</li>
                <li>Publishing Insights</li>
              </ul>
            </div>

            <div className="admin-card">
              <h3>Activity Timeline</h3>

              <ul>
                <li>Recent Actions</li>
                <li>Workflow Changes</li>
                <li>Override Events</li>
                <li>Editorial History</li>
              </ul>
            </div>

            <div className="admin-card">
              <h3>Live Newsroom</h3>

              <ul>
                <li>SSE Connection</li>
                <li>Heartbeat Monitor</li>
                <li>Live Updates</li>
                <li>Real-Time Events</li>
              </ul>
            </div>

            <div className="admin-card">
              <h3>Homepage Simulator</h3>

              <ul>
                <li>Hero Preview</li>
                <li>Breaking Preview</li>
                <li>Trending Preview</li>
                <li>Live Refresh</li>
              </ul>
            </div>

            <div className="admin-card">
              <h3>Notification Center</h3>

              <ul>
                <li>Workflow Alerts</li>
                <li>Breaking Alerts</li>
                <li>Live Feed</li>
                <li>Editorial Events</li>
              </ul>
            </div>

            <div className="admin-card">
              <h3>System Status</h3>

              <ul>
                <li>Workflow Engine ✓</li>
                <li>Override Engine ✓</li>
                <li>Ranking Engine ✓</li>
                <li>Homepage Preview ✓</li>
                <li>Homepage Simulator ✓</li>
                <li>Notification Center ✓</li>
                <li>Audit Logs ✓</li>
                <li>Hero Ordering ✓</li>
                <li>Hero Board ✓</li>
                <li>Breaking Controls ✓</li>
                <li>Editorial Analytics ✓</li>
                <li>Activity Timeline ✓</li>
                <li>Live SSE ✓</li>
              </ul>
            </div>

            <div className="admin-card">
              <h3>Coming Next</h3>

              <ul>
                <li>Homepage Auto Refresh</li>
                <li>Analytics Charts</li>
                <li>Drag & Drop Hero Ordering</li>
                <li>Multi-Editor Roles</li>
                <li>Real-Time Collaboration</li>
                <li>AI Story Scoring</li>
                <li>Google Discover Scoring</li>
              </ul>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}