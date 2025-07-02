// SQL语句步骤详细解释
window.sqlStepDetails = {
  'FROM': {
    title: '数据来源（FROM）',
    description: '指定查询所需的表或视图',
    detail: `<p>FROM子句是SQL查询的基础，它指明数据从哪里来。可以理解为搭建查询的"舞台"。</p>
    <p><strong>详细说明：</strong></p>
    <ul>
      <li>FROM子句是查询真正的起点，是最先执行的步骤</li>
      <li>可以指定一个或多个表（多表会形成笛卡尔积）</li>
      <li>表可以使用别名（AS关键字，可省略）</li>
      <li>也可以是子查询（派生表）或视图</li>
      <li>在FROM子句中，表被完整加载到内存中</li>
    </ul>
    <p><strong>示例：</strong></p>
    <pre>FROM employees</pre>
    <pre>FROM employees AS e, departments AS d</pre>
    <pre>FROM (SELECT * FROM transactions WHERE year = 2023) AS t</pre>`
  },
  'JOIN & ON': {
    title: '表连接（JOIN & ON）',
    description: '连接多个表并设定关联条件',
    detail: `<p>JOIN操作用于连接多个表，而ON子句定义表之间的连接条件，是多表查询的核心机制。</p>
    <p><strong>详细说明：</strong></p>
    <ul>
      <li><strong>INNER JOIN（内连接）</strong>：只返回两表中匹配的行</li>
      <li><strong>LEFT JOIN（左连接）</strong>：返回左表全部行和右表匹配行</li>
      <li><strong>RIGHT JOIN（右连接）</strong>：返回右表全部行和左表匹配行</li>
      <li><strong>FULL JOIN（全连接）</strong>：返回两表的全部行，无论是否匹配</li>
      <li><strong>ON条件</strong>：指定连接键（通常是外键与主键的关系）</li>
      <li>连接可以链式执行，连接多个表</li>
      <li>连接操作在WHERE过滤之前执行</li>
    </ul>
    <p><strong>示例：</strong></p>
    <pre>JOIN departments ON employees.dept_id = departments.id</pre>
    <pre>LEFT JOIN orders ON customers.id = orders.customer_id</pre>
    <pre>JOIN projects USING (department_id)</pre>`
  },
  'WHERE': {
    title: '条件过滤（WHERE）',
    description: '根据条件筛选原始数据行',
    detail: `<p>WHERE子句在数据源加载后最先执行，用于筛选符合特定条件的行，减少后续处理的数据量。</p>
    <p><strong>详细说明：</strong></p>
    <ul>
      <li>在FROM和JOIN操作之后、GROUP BY之前执行</li>
      <li>使用比较运算符：=, <>, <, >, <=, >=</li>
      <li>使用逻辑运算符：AND, OR, NOT</li>
      <li>其他常用条件：IN, BETWEEN, LIKE, IS NULL</li>
      <li>可使用子查询作为条件值</li>
      <li>只处理行级数据，不能使用聚合函数（除非在子查询中）</li>
    </ul>
    <p><strong>示例：</strong></p>
    <pre>WHERE salary > 5000</pre>
    <pre>WHERE department = 'Sales' AND hire_date > '2020-01-01'</pre>
    <pre>WHERE manager_id IN (SELECT id FROM employees WHERE level = 'Director')</pre>`
  },
  'GROUP BY': {
    title: '分组（GROUP BY）',
    description: '按指定列对数据进行分组，为聚合做准备',
    detail: `<p>GROUP BY子句将数据划分为多个组，为后续的聚合操作做准备。每个组可以应用聚合函数计算汇总值。</p>
    <p><strong>详细说明：</strong></p>
    <ul>
      <li>在WHERE过滤后执行，在SELECT之前</li>
      <li>可以按一列或多列进行分组</li>
      <li>分组后，SELECT子句中只能包含分组列和聚合函数</li>
      <li>常与聚合函数一起使用：COUNT(), SUM(), AVG(), MAX(), MIN()</li>
      <li>NULL值会被当作一个独立的组</li>
      <li>分组可以嵌套（先按列A分组，组内再按列B分组）</li>
    </ul>
    <p><strong>示例：</strong></p>
    <pre>GROUP BY department</pre>
    <pre>GROUP BY department, YEAR(hire_date)</pre>
    <pre>GROUP BY ROLLUP(region, department) -- 生成小计和总计</pre>`
  },
  'HAVING': {
    title: '分组过滤（HAVING）',
    description: '对分组后的结果进行筛选',
    detail: `<p>HAVING子句用于对GROUP BY分组后的结果进行筛选，而不是像WHERE那样对原始行进行筛选。</p>
    <p><strong>详细说明：</strong></p>
    <ul>
      <li>在GROUP BY之后、SELECT之前执行</li>
      <li>只有在使用了GROUP BY时才有意义</li>
      <li>可以使用聚合函数作为过滤条件</li>
      <li>语法与WHERE类似，但作用对象不同</li>
      <li>HAVING过滤组，WHERE过滤行</li>
      <li>可以引用SELECT中定义的别名（在某些数据库中）</li>
    </ul>
    <p><strong>示例：</strong></p>
    <pre>HAVING COUNT(*) > 3</pre>
    <pre>HAVING AVG(salary) > 5000 AND COUNT(*) >= 5</pre>
    <pre>HAVING SUM(sales) > (SELECT AVG(sales) * 1.5 FROM departments)</pre>`
  },
  'SELECT': {
    title: '选择字段（SELECT）',
    description: '指定查询返回的列和表达式',
    detail: `<p>SELECT子句指定要从查询中返回哪些列、表达式或计算值，决定最终结果的结构。</p>
    <p><strong>详细说明：</strong></p>
    <ul>
      <li>逻辑上首先被处理，但在实际执行中较晚（在FROM, WHERE, GROUP BY, HAVING之后）</li>
      <li>可以选择特定列、所有列(*)、表达式或聚合函数结果</li>
      <li>可以使用AS关键字为列指定别名</li>
      <li>如果使用了GROUP BY，则SELECT中只能包含分组列和聚合函数</li>
      <li>可以包含子查询，称为相关子查询或标量子查询</li>
      <li>可以使用CASE表达式进行条件逻辑</li>
    </ul>
    <p><strong>示例：</strong></p>
    <pre>SELECT employee_name, department, salary</pre>
    <pre>SELECT department, COUNT(*) as emp_count, AVG(salary) as avg_salary</pre>
    <pre>SELECT CONCAT(first_name, ' ', last_name) as full_name</pre>`
  },
  'DISTINCT': {
    title: '去重（DISTINCT）',
    description: '删除结果集中的重复行',
    detail: `<p>DISTINCT关键字用于消除查询结果中的重复行，确保每个值组合在结果集中只出现一次。</p>
    <p><strong>详细说明：</strong></p>
    <ul>
      <li>在SELECT子句之后应用</li>
      <li>比较整行的所有选定列以确定唯一性</li>
      <li>可以显著减少结果集大小，但可能影响性能</li>
      <li>NULL值在比较中被视为相等</li>
      <li>可以与聚合函数一起使用，如COUNT(DISTINCT column)</li>
      <li>某些数据库支持DISTINCT ON子句，允许基于特定列去重</li>
    </ul>
    <p><strong>示例：</strong></p>
    <pre>SELECT DISTINCT department FROM employees</pre>
    <pre>SELECT COUNT(DISTINCT department) FROM employees</pre>
    <pre>SELECT DISTINCT city, state FROM addresses</pre>`
  },
  'ORDER BY': {
    title: '排序（ORDER BY）',
    description: '按指定列对结果集进行排序',
    detail: `<p>ORDER BY子句用于对查询结果进行排序，可以按一个或多个列进行升序或降序排列。</p>
    <p><strong>详细说明：</strong></p>
    <ul>
      <li>在查询处理的最后阶段执行（除了LIMIT）</li>
      <li>默认为升序(ASC)，可以指定为降序(DESC)</li>
      <li>可以按多个列排序，按列的先后顺序依次排序</li>
      <li>可以使用列的位置编号代替列名（不推荐）</li>
      <li>可以使用SELECT中定义的别名</li>
      <li>NULL值的排序规则视数据库而定（通常认为NULL最小或最大）</li>
      <li>可以使用NULLS FIRST或NULLS LAST指定NULL值排序位置（某些数据库支持）</li>
    </ul>
    <p><strong>示例：</strong></p>
    <pre>ORDER BY salary DESC</pre>
    <pre>ORDER BY department ASC, salary DESC</pre>
    <pre>ORDER BY hire_date DESC NULLS LAST</pre>`
  },
  'LIMIT': {
    title: '限制结果（LIMIT）',
    description: '限制返回的行数',
    detail: `<p>LIMIT子句用于限制查询返回的行数，通常用于分页显示或获取前N条记录。</p>
    <p><strong>详细说明：</strong></p>
    <ul>
      <li>是查询处理的最后一步</li>
      <li>在所有其他处理完成后应用</li>
      <li>可以接受一个参数(行数)或两个参数(偏移量,行数)</li>
      <li>在不同数据库有不同语法：
        <ul>
          <li>MySQL/PostgreSQL: LIMIT 10 OFFSET 20</li>
          <li>SQL Server: TOP 10 / OFFSET 20 ROWS FETCH NEXT 10 ROWS ONLY</li>
          <li>Oracle: ROWNUM <= 10 / OFFSET 20 ROWS FETCH NEXT 10 ROWS ONLY</li>
        </ul>
      </li>
      <li>通常与ORDER BY一起使用以确保结果的一致性</li>
      <li>对于分页查询非常有用</li>
    </ul>
    <p><strong>示例：</strong></p>
    <pre>LIMIT 10</pre>
    <pre>LIMIT 10 OFFSET 20 -- 返回第21-30行</pre>
    <pre>LIMIT 10, 20 -- MySQL语法，偏移10行，返回20行</pre>`
  }
}; 