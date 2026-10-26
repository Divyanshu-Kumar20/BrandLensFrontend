import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api';

// Fetch all content items
export const fetchContentList = createAsyncThunk(
  'content/fetchList',
  async (status, { rejectWithValue }) => {
    try {
      const list = await api.getContentList(status);
      return list;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch content list');
    }
  }
);

// Fetch single content with versions and findings
export const fetchContentDetail = createAsyncThunk(
  'content/fetchDetail',
  async (contentId, { rejectWithValue }) => {
    try {
      const data = await api.getContentById(contentId);
      const latestVersion = data.versions?.[0] || null;
      let findings = [];
      if (latestVersion) {
        findings = await api.getVersionFindings(contentId, latestVersion.number);
      }
      return {
        content: data.content,
        versions: data.versions || [],
        findings,
      };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch content details');
    }
  }
);

// Create new content and immediately trigger initial review
export const createAndReviewContent = createAsyncThunk(
  'content/createAndReview',
  async ({ title, channel, text, useAi, userName }, { rejectWithValue }) => {
    try {
      const { content, version } = await api.createContent({
        title,
        channel,
        text,
        userName,
      });

      const reviewResult = await api.reviewContent(content.id, {
        versionId: version.id,
        useAi,
      });

      return {
        content,
        version: {
          ...version,
          aiUsed: reviewResult.aiUsed,
          aiModel: reviewResult.aiUsed ? 'gemini-1.5-pro' : null,
        },
        findings: reviewResult.findings || [],
        reviewResult,
      };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to create and check content draft');
    }
  }
);

// Re-check existing content version
export const recheckContent = createAsyncThunk(
  'content/recheck',
  async ({ contentId, versionId, useAi }, { rejectWithValue }) => {
    try {
      const reviewResult = await api.reviewContent(contentId, {
        versionId,
        useAi,
      });
      return reviewResult;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to review draft');
    }
  }
);

// Patch finding status (accepted, edited, disputed)
export const patchFindingStatus = createAsyncThunk(
  'content/patchFinding',
  async ({ findingId, status, disputeReason, editedText, resolvedByName }, { rejectWithValue }) => {
    try {
      const updated = await api.patchFinding(findingId, {
        status,
        disputeReason,
        editedText,
        resolvedByName,
      });
      return updated;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update finding');
    }
  }
);

// Save as new version and immediately re-run review check
export const saveNewVersionAndReview = createAsyncThunk(
  'content/saveNewVersionAndReview',
  async ({ contentId, basedOnVersionId, fixes, useAi = true }, { rejectWithValue }) => {
    try {
      // 1. POST /content/:id/versions
      const newVersion = await api.createVersion(contentId, {
        basedOnVersionId,
        fixes,
      });

      // 2. POST /content/:id/review
      const reviewResult = await api.reviewContent(contentId, {
        versionId: newVersion.id,
        useAi,
      });

      return {
        newVersion: {
          ...newVersion,
          aiUsed: reviewResult.aiUsed,
          aiModel: reviewResult.aiUsed ? 'gemini-1.5-pro' : null,
        },
        findings: reviewResult.findings || [],
        reviewResult,
      };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to save new version');
    }
  }
);

const initialState = {
  list: [],
  current: null,
  versions: [],
  findings: [],
  loading: false,
  reviewing: false,
  savingVersion: false,
  error: null,
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    clearContentError(state) {
      state.error = null;
    },
    setCurrentContent(state, action) {
      const { content, versions = [] } = action.payload;
      state.current = content;
      state.versions = versions;
    },
    setFindings(state, action) {
      state.findings = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch List
      .addCase(fetchContentList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContentList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchContentList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Detail
      .addCase(fetchContentDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContentDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload.content;
        state.versions = action.payload.versions;
        state.findings = action.payload.findings;
      })
      .addCase(fetchContentDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create and Review
      .addCase(createAndReviewContent.pending, (state) => {
        state.reviewing = true;
        state.error = null;
      })
      .addCase(createAndReviewContent.fulfilled, (state, action) => {
        state.reviewing = false;
        state.current = action.payload.content;
        state.versions = [action.payload.version];
        state.findings = action.payload.findings;
      })
      .addCase(createAndReviewContent.rejected, (state, action) => {
        state.reviewing = false;
        state.error = action.payload;
      })

      // Recheck
      .addCase(recheckContent.pending, (state) => {
        state.reviewing = true;
      })
      .addCase(recheckContent.fulfilled, (state, action) => {
        state.reviewing = false;
        state.findings = action.payload.findings;
      })
      .addCase(recheckContent.rejected, (state, action) => {
        state.reviewing = false;
        state.error = action.payload;
      })

      // Patch finding
      .addCase(patchFindingStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.findings.findIndex((f) => f.id === updated.id);
        if (index !== -1) {
          state.findings[index] = updated;
        }
      })

      // Save new version and review
      .addCase(saveNewVersionAndReview.pending, (state) => {
        state.savingVersion = true;
        state.error = null;
      })
      .addCase(saveNewVersionAndReview.fulfilled, (state, action) => {
        state.savingVersion = false;
        const { newVersion, findings } = action.payload;
        state.versions.unshift(newVersion);
        if (state.current) {
          state.current.currentVersion = newVersion.number;
          state.current.updatedAt = new Date().toISOString();
        }
        state.findings = findings;
      })
      .addCase(saveNewVersionAndReview.rejected, (state, action) => {
        state.savingVersion = false;
        state.error = action.payload;
      });
  },
});

export const { clearContentError, setCurrentContent, setFindings } = contentSlice.actions;

export default contentSlice.reducer;
