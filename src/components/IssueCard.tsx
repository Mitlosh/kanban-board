const IssueCard = ({ issue }: any) => {
  const dateStr = issue.created_at;
  const dateObj = new Date(dateStr);
  const formattedDate = dateObj.toLocaleDateString("uk-UA");

  return (
    <>
      <div
        style={{
          textAlign: "left",
          userSelect: "none",
          padding: 16,
          marginBottom: "8px",
          minHeight: "50px",
          border: "1px solid lightgrey",
          borderRadius: "8px",
        }}>
        <p>{issue.title}</p>
        <p className="m-0">{formattedDate}</p>
      </div>
    </>
  );
};

export default IssueCard;
