// SQL语句示例与顺序结构
window.sqlExamples = [
  {
    name: '统计每个部门高薪员工数',
    description: '查询每个部门工资高于5000的员工数量，并按数量降序排列，只显示数量大于3的部门。',
    steps: ['FROM', 'JOIN & ON', 'WHERE', 'GROUP BY', 'HAVING', 'SELECT', 'DISTINCT', 'ORDER BY', 'LIMIT'],
    sql: `SELECT DISTINCT department, COUNT(*) as emp_count\nFROM employees\nJOIN departments ON employees.dept_id = departments.id\nWHERE salary > 5000\nGROUP BY department\nHAVING COUNT(*) > 3\nORDER BY emp_count DESC\nLIMIT 10;`
  },
  {
    name: '查询唯一部门',
    description: '查询所有不重复的部门名称。',
    steps: ['FROM', 'SELECT', 'DISTINCT'],
    sql: `SELECT DISTINCT department\nFROM employees;`
  },
  {
    name: '按部门统计平均工资',
    description: '统计每个部门的平均工资，并按平均工资从高到低排序。',
    steps: ['FROM', 'GROUP BY', 'SELECT', 'ORDER BY'],
    sql: `SELECT department, AVG(salary) as avg_salary\nFROM employees\nGROUP BY department\nORDER BY avg_salary DESC;`
  },
  {
    name: '找出高于部门平均薪资的员工',
    description: '查找薪水高于其所在部门平均薪水的员工，帮助识别各部门的高绩效人员。',
    steps: ['FROM', 'WHERE', 'SELECT'],
    sql: `SELECT employee_name, salary, department\nFROM employees e\nWHERE salary > (\n  SELECT AVG(salary)\n  FROM employees\n  WHERE department = e.department\n);`
  },
  {
    name: '部门内员工薪资排名',
    description: '为每个部门的员工按薪水高低进行排名，帮助人力资源了解各部门的薪资分布情况。',
    steps: ['FROM', 'SELECT', 'ORDER BY'],
    sql: `SELECT employee_name, department, salary,\n  RANK() OVER (PARTITION BY department ORDER BY salary DESC) as dept_rank\nFROM employees\nORDER BY department, dept_rank;`
  },
  {
    name: '员工薪资等级划分',
    description: '根据薪资水平将员工分为高、中、低三个等级，用于薪资结构分析和福利规划。',
    steps: ['FROM', 'SELECT'],
    sql: `SELECT employee_name, salary,\n  CASE\n    WHEN salary < 3000 THEN '低'\n    WHEN salary BETWEEN 3000 AND 6000 THEN '中'\n    ELSE '高'\n  END as salary_level\nFROM employees;`
  },
  {
    name: '员工项目参与情况',
    description: '查询每个员工参与的活跃项目信息，帮助项目经理了解人力资源分配情况。',
    steps: ['FROM', 'JOIN & ON', 'JOIN & ON', 'WHERE', 'SELECT', 'ORDER BY'],
    sql: `SELECT e.employee_name, d.department_name, p.project_name\nFROM employees e\nJOIN departments d ON e.dept_id = d.id\nJOIN project_assignments pa ON e.id = pa.employee_id\nJOIN projects p ON pa.project_id = p.id\nWHERE p.status = 'active'\nORDER BY d.department_name, e.employee_name;`
  },
  {
    name: '高薪职位分析报告',
    description: '分析各部门不同职位的平均薪资和人员分布，只关注高薪(>5000)的职位组合。',
    steps: ['FROM', 'GROUP BY', 'HAVING', 'SELECT', 'ORDER BY'],
    sql: `SELECT department, position, AVG(salary) as avg_salary, COUNT(*) as employee_count\nFROM employees\nGROUP BY department, position\nHAVING AVG(salary) > 5000\nORDER BY avg_salary DESC;`
  },
  {
    name: '公司组织架构图',
    description: '查询公司的管理层次结构，展示每位员工及其管理者的关系，帮助了解组织架构。',
    steps: ['WITH', 'FROM', 'JOIN & ON', 'SELECT'],
    sql: `WITH RECURSIVE org_hierarchy AS (\n  SELECT id, employee_name, manager_id, 1 as level\n  FROM employees\n  WHERE manager_id IS NULL\n  UNION ALL\n  SELECT e.id, e.employee_name, e.manager_id, oh.level + 1\n  FROM employees e\n  JOIN org_hierarchy oh ON e.manager_id = oh.id\n)\nSELECT employee_name, level, (\n  SELECT employee_name FROM employees WHERE id = org_hierarchy.manager_id\n) as manager_name\nFROM org_hierarchy\nORDER BY level, employee_name;`
  },
  {
    name: '部门季度销售报表',
    description: '生成各部门在四个季度的销售业绩汇总表，方便管理层比较不同时期的业绩表现。',
    steps: ['FROM', 'GROUP BY', 'SELECT'],
    sql: `SELECT department,\n  SUM(CASE WHEN quarter = 'Q1' THEN sales_amount ELSE 0 END) as Q1_sales,\n  SUM(CASE WHEN quarter = 'Q2' THEN sales_amount ELSE 0 END) as Q2_sales,\n  SUM(CASE WHEN quarter = 'Q3' THEN sales_amount ELSE 0 END) as Q3_sales,\n  SUM(CASE WHEN quarter = 'Q4' THEN sales_amount ELSE 0 END) as Q4_sales,\n  SUM(sales_amount) as yearly_total\nFROM sales\nGROUP BY department\nORDER BY yearly_total DESC;`
  }
]; 