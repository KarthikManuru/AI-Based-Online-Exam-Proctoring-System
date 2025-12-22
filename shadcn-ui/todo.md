# CSE Department Event Quiz - Development Plan

## Design Guidelines

### Design References
- Modern quiz platforms (Kahoot, Quizizz) for UX patterns
- Clean admin dashboards for management interface
- Style: Modern Minimalism with Strict Color Palette

### Color Palette (STRICT - Only these colors allowed)
- Background: #FFFFFF (White)
- Text Primary: #000000 (Black)
- Primary CTA/Buttons: #16A34A (Green)
- Secondary/Accent: #2563EB (Blue)
- Success: #16A34A (Green)
- Error/Warning: #DC2626 (Red - minimal use for alerts only)
- Border/Divider: #E5E7EB (Light Gray)

### Typography
- Heading1: Inter font-weight 700 (32px)
- Heading2: Inter font-weight 600 (24px)
- Heading3: Inter font-weight 600 (18px)
- Body: Inter font-weight 400 (16px)
- Small: Inter font-weight 400 (14px)

### Key Component Styles
- **Buttons**: Green background (#16A34A), white text, 8px rounded, hover: darken 10%
- **Cards**: White background, 1px border (#E5E7EB), 12px rounded, subtle shadow
- **Inputs**: White background, 1px border (#E5E7EB), 8px rounded, focus: blue border
- **Admin Panel**: Blue accents for navigation, green for action buttons

### Layout & Spacing
- Container max-width: 1200px
- Section padding: 40px vertical, 20px horizontal
- Card padding: 24px
- Button padding: 12px 24px
- Grid gaps: 16px

---

## Development Tasks

### Phase 1: Project Setup & Data Structure
1. Initialize Shadcn-UI template
2. Install dependencies (IndexedDB wrapper, date utilities)
3. Create data structure for questions (4 sets A, B, C, D with 10 questions each)
4. Set up IndexedDB schema for attempts, exam config, admin logs

### Phase 2: Core Services & Utilities
5. Create IndexedDB service for data persistence
6. Create exam state management service
7. Create anti-cheat detection utilities
8. Create camera/proctoring utilities
9. Create question set allocation logic (round-robin)

### Phase 3: Authentication & Start Flow
10. Create StartForm component (Name, Student ID, Email)
11. Implement exam availability check
12. Implement one-attempt-per-ID validation
13. Implement camera permission request for proctored mode
14. Create privacy consent modal

### Phase 4: Quiz Interface
15. Create Quiz component with timer (10 minutes)
16. Create QuestionDisplay component
17. Create SideQuestionBar component (desktop) / BottomNav (mobile)
18. Implement question navigation
19. Implement answer selection and storage
20. Create timer countdown with auto-submit

### Phase 5: Anti-Cheat System
21. Implement visibility change detection
22. Implement right-click prevention
23. Implement copy/paste prevention
24. Implement tab switch detection
25. Create CheatOverlay component with admin unlock
26. Implement cheat flagging in database

### Phase 6: Admin Panel
27. Create AdminLogin component
28. Create AdminDashboard layout
29. Implement exam open/close toggle
30. Implement proctored mode toggle
31. Implement admin reset code configuration
32. Create AttemptsList component
33. Implement attempt details view
34. Implement CSV export functionality
35. Implement force unlock attempt feature

### Phase 7: Results & Completion
36. Create ResultScreen component
37. Implement score calculation
38. Implement response storage with correctness
39. Create submission flow

### Phase 8: Responsive Design & Polish
40. Implement mobile-responsive layouts
41. Add loading states and transitions
42. Add error handling and user feedback
43. Implement accessibility features
44. Final testing and bug fixes

### Phase 9: Documentation
45. Create comprehensive README with setup instructions
46. Document all features and usage
47. Create demo credentials and test data